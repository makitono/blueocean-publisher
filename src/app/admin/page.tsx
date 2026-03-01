'use client';

import { useState } from 'react';
import { createPostAction, ActionResponse } from './actions';

export default function AdminPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ActionResponse | null>(null);

    // フォーム送信ハンドラ
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setResponse(null);

        const formData = new FormData(event.currentTarget);

        // Server Actionを実行
        const result = await createPostAction(formData);

        setResponse(result);
        setLoading(false);

        if (result.success) {
            // 成功した場合はフォームをリセット（お好みで）
            event.currentTarget.reset();
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">記事管理ダッシュボード</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 左側: 入力フォーム */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold mb-6">新規記事作成</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">タイトル *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                placeholder="例: 爆速ブログの作り方"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">スラッグ (URL) *</label>
                            <input
                                id="slug"
                                name="slug"
                                type="text"
                                required
                                placeholder="例: how-to-make-fast-blog"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">本文 (Markdown形式) *</label>
                            <textarea
                                id="content"
                                name="content"
                                rows={8}
                                required
                                placeholder="# 本文の見出し..."
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white font-mono text-sm leading-relaxed"
                            ></textarea>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">SNS連携オプション (任意)</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="microcopy" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">マイクロコピー (X用)</label>
                                    <input
                                        id="microcopy"
                                        name="microcopy"
                                        type="text"
                                        placeholder="例: ＼ 必見・初心者向け！ ／"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ハッシュタグ (カンマ区切り)</label>
                                    <input
                                        id="tags"
                                        name="tags"
                                        type="text"
                                        placeholder="例: Nextjs, ブログ作成, アフィリエイト"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    保存中...
                                </>
                            ) : '公開する'}
                        </button>
                    </form>

                    {/* 送信結果メッセージ */}
                    {response && (
                        <div className={`mt-6 p-4 rounded-lg border ${response.success ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'}`}>
                            {response.message}
                        </div>
                    )}
                </section>

                {/* 右側: プレビューエリア */}
                <section className="space-y-6">
                    <h2 className="text-xl font-semibold opacity-0">Results</h2>

                    {response?.success && response.snsPreview ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl shadow-sm border border-indigo-100 dark:border-slate-700 mb-6">
                                <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-400 font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                                    X (Twitter) 投稿プレビュー
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {response.snsPreview.x}
                                </pre>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z" /></svg>
                                    Pinterest 説明文プレビュー
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    {response.snsPreview.pinterest}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-400 h-full flex flex-col items-center justify-center min-h-[400px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                            <p>記事を公開すると、ここに連携先SNS<br />(X, Pinterest) 用の投稿テキストが<br />自動生成・プレビュー表示されます。</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
