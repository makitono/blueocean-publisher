/**
 * SNSへの半自動投稿用モジュール
 */

/**
 * 投稿対象となる記事やコンテンツのデータ構造
 */
export interface PublishData {
    title: string;
    url: string;
    microcopy?: string; // 例: "＼ 期間限定セール中！ ／"
    tags?: string[];    // 例: ["おすすめ", "ガジェット"]
    description?: string; // 概要文
}

/**
 * X (Twitter) 用の投稿テキストを生成する
 * タイトル、URL、マイクロコピー、およびハッシュタグを組み合わせて魅力的なテキストを作成します。
 */
export function generateXPostText(data: PublishData): string {
    const { title, url, microcopy, tags = [] } = data;

    // ハッシュタグの文字列を作成 (#tag1 #tag2 ...)
    const hashtags = tags.map(tag => `#${tag}`).join(' ');

    // X用の定型文組み立て
    const parts = [];

    // 1. マイクロコピーがあれば一番目立たせる
    if (microcopy) {
        parts.push(`【${microcopy.replace(/＼|／|!|！/g, '').trim()}】\n`);
    }

    // 2. タイトル
    parts.push(`${title}\n`);

    // 3. アピール文言（ダミー）
    parts.push(`👇 気になる方はこちらからチェック！\n`);

    // 4. URL
    parts.push(`${url}\n`);

    // 5. ハッシュタグ
    if (hashtags) {
        parts.push(`\n${hashtags}`);
    }

    return parts.join('');
}

/**
 * Pinterest 用の説明文 (Description) を生成する
 * Pinterestの検索に掛かりやすいように、概要やタイトル、タグを強調したフォーマットにします。
 */
export function generatePinterestDescription(data: PublishData): string {
    const { title, url, description, tags = [] } = data;

    const hashtags = tags.map(tag => `#${tag}`).join(' ');

    const parts = [];

    // 1. ピンのタイトル相当
    parts.push(`📌 ${title}\n\n`);

    // 2. 本文/概要
    if (description) {
        parts.push(`${description}\n\n`);
    } else {
        parts.push(`このアイテムの詳しいレビューやお得な購入方法はブログ記事をチェックしてください！\n\n`);
    }

    // 3. リンク誘導
    parts.push(`🔗 詳細を見る: ${url}\n\n`);

    // 4. ハッシュタグ (Pinterestでも検索用として有効)
    if (hashtags) {
        parts.push(`${hashtags}`);
    }

    return parts.join('');
}

/**
 * SNSへ自動/半自動投稿を行う関数 (現在はダミー実装)
 */
export async function publishToSNS(data: PublishData): Promise<void> {
    const xText = generateXPostText(data);
    const pinterestText = generatePinterestDescription(data);

    console.log('====== 🚀 Publishing to SNS (Dummy) ======');

    console.log('\n[X (Twitter) Post Preview]');
    console.log('------------------------------------------');
    console.log(xText);
    console.log('------------------------------------------');

    console.log('\n[Pinterest Description Preview]');
    console.log('------------------------------------------');
    console.log(pinterestText);
    console.log('------------------------------------------');

    console.log('\n==========================================');

    // FIXME: 将来的にここで Twitter API (v2) や Pinterest API の処理を呼び出す
}
