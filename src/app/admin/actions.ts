'use server';

import { createClient } from '@/lib/supabase-server';
import { generateXPostText, generatePinterestDescription, PublishData } from '@/lib/sns-publisher';
import { revalidatePath } from 'next/cache';

export interface ActionResponse {
    success: boolean;
    message: string;
    snsPreview?: {
        x: string;
        pinterest: string;
    };
}

/**
 * 記事をSupabaseに保存し、SNS用のテキストを生成して返すServer Action
 */
export async function createPostAction(formData: FormData): Promise<ActionResponse> {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;

    // SNS投稿用のオプショナルデータ
    const microcopy = formData.get('microcopy') as string | undefined;
    const tagsStr = formData.get('tags') as string | undefined;
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (!title || !slug || !content) {
        return { success: false, message: 'タイトル、スラッグ、本文は必須項目です。' };
    }

    try {
        const supabase = await createClient();

        // 1. Supabaseへ記事を保存
        const { error } = await supabase.from('posts').insert([
            { title, slug, content, published_at: new Date().toISOString() }
        ]);

        if (error) {
            console.error('Insert Error:', error);
            return { success: false, message: `保存エラー: ${error.message}` };
        }

        // 2. トップページのキャッシュを再検証（最新記事が反映されるようにする）
        revalidatePath('/');

        // 3. SNS連携モジュールを呼び出し、テキストを生成
        // (デモ用としてURLはダミーリンクを使用します)
        const postUrl = `https://your-domain.com/posts/${slug}`;
        const publishData: PublishData = {
            title,
            url: postUrl,
            microcopy: microcopy || undefined,
            tags,
            description: content.substring(0, 100) + '...', // 本文の先頭を簡易説明として使う
        };

        const xText = generateXPostText(publishData);
        const pinterestText = generatePinterestDescription(publishData);

        // （オプション）本番ではここで非同期APIを呼び出す仕組みが入る
        console.log('✅ Post saved correctly and SNS preview generated.');

        return {
            success: true,
            message: '記事の公開が完了しました！',
            snsPreview: {
                x: xText,
                pinterest: pinterestText,
            }
        };

    } catch (err: any) {
        return { success: false, message: `予期せぬエラーが発生しました: ${err.message}` };
    }
}
