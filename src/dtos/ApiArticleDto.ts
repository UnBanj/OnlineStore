export default interface ApiArticleDto {
    articleId: number;
    name: string;
    categoryId: number;
    description: string;
    excerpt: string;
    status: "available" | "visible" | "hidden";
    isPromoted: number;
    articleFeatures: {
        articleFeatureId: number;
        featureId: number;
        value: string;
    }[];
    features: {
        featureId: number;
        name: string;
    }[];
    articlePrices: {
        articlePriceId: number;
        price: number;

    }[];
    photos: {
        photoId: number;
        imagePath: string;
    }[];
    category: {
        name: string;
    };
}