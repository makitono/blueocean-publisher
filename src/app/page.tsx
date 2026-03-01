import { supabase } from '@/lib/supabase';
import AmazonLink from '@/components/AmazonLink';

// キャッシュを無効化して毎回最新のデータを取得する場合（必要に応じて調整してください）
// export const revalidate = 0;

export default async function Home() {
    // Supabaseから記事一覧を取得
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
    }

    return (
        <div className="space-y-12">
            <header className="mb-10 border-b pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-white mb-4">
                    アフィリエイトブログへようこそ！
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400">
                    Next.jsとSupabaseで構築された高速なアフィリエイトプラットフォームです。
                </p>
            </header>

            {/* サンプル: Amazonリンクコンポーネント (固定) */}
            <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 my-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 mt-0">当サイトのイチオシ商品</h2>
                <AmazonLink
                    href="https://www.amazon.co.jp/"
                    title="Amazonで今すぐチェック"
                    microcopy="＼ 期間限定セール開催中！ ／"
                />
            </section>

            {/* 記事一覧表示エリア */}
            <section>
                <h2 className="text-3xl font-bold mb-6">最新の記事</h2>

                {!posts || posts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center text-slate-500">
                        記事がありません。Supabaseのpostsテーブルにデータを追加してください。
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <article key={post.id} className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 h-full flex flex-col">
                                    {/* 日付 */}
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                        {new Date(post.created_at).toLocaleDateString('ja-JP')}
                                    </div>
                                    {/* タイトル */}
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    {/* リンク(ダミー) */}
                                    <div className="mt-auto pt-4 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center">
                                        記事を読む
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    {/* ここでは slug をベースに記事詳細ページへ遷移する想定ですが、一覧表示のみの要件としています */}
                                    <a href={`/posts/${post.slug}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">記事を読む: {post.title}</span>
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
