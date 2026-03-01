/**
 * Amazon PA-API用関数のダミー実装
 * 
 * 将来的にはここでAmazonの商品情報を取得する処理を実装します。
 */

export interface AmazonProduct {
    asin: string;
    title: string;
    price?: string;
    imageUrl?: string;
    detailPageUrl: string;
}

/**
 * ダミーの商品情報を取得する関数
 * @param asin Amazon Standard Identification Number
 */
export async function getAmazonProductInfo(asin: string): Promise<AmazonProduct | null> {
    // TODO: `amazon-paapi` 等のSDKを使用して実際のデータを取得する処理を実装

    // ダミーデータを返す
    return {
        asin,
        title: `ダミー商品 (ASIN: ${asin})`,
        price: "￥2,980",
        imageUrl: "https://via.placeholder.com/300?text=Amazon+Product",
        detailPageUrl: `https://www.amazon.co.jp/dp/${asin}?tag=${process.env.AMAZON_PARTNER_TAG || 'dummy-22'}`,
    };
}
