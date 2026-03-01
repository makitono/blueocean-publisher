import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MDXRemote } from 'next-mdx-remote/rsc';
import AmazonLink from '@/components/AmazonLink';

const components = {
    AmazonLink,
    AmazonButton: AmazonLink, // エラー回避: AmazonButtonという名前でも呼び出せるようにエイリアスを追加
    // h1タグなどを独自のスタイルに上書きしたい場合はここに追加します
    // h1: (props) => <h1 className="..." {...props} />
};

export const revalidate = 60; // 60秒ごとにトップページからISR的に更新（任意）

/**
 * 記事詳細ページ
 * URL: /posts/[slug]
 */
export default async function PostPage({ params }: { params: { slug: string } }) {
    // Promiseからslugを取り出す (Next.js 14 -> 15に向けての暫定的な対応と一般的なプラクティス)
    // TypeScriptのエラー回避のため paramsをawaitするかはNextのバージョンによりますが、AppRouterでは非同期paramsが推奨
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;

    // Supabaseから該当スラッグの記事を取得
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    // エラーがある、または記事が見つからない場合は 404 へリダイレクト
    if (error || !post) {
        if (error && error.code !== 'PGRST116') { // PGRST116 is "multiple (or no) rows returned"
            console.error('Error fetching post detail:', error);
        }
        notFound();
    }

    // 日付のフォーマット
    const publishedDate = new Date(post.published_at || post.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* 記事ヘッダー (タイトルや日付など) */}
            <header className="mb-10 text-center border-b border-slate-200 dark:border-slate-800 pb-10">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                    Published on {publishedDate}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {post.title}
                </h1>
            </header>

            {/* 記事本文: Tailwind Typography (prose) を適用し、MDXRemoteで描画 */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500">
                <MDXRemote source={post.content} components={components} />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                <a href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium font-sans flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    記事一覧へ戻る
                </a>
            </div>
        </article>
    );
}
