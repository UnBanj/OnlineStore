import ArticleType from "./ArticleType";

export default class CategoryType {
    categoryId?: number; //? pored imena znaci da ne mora da bude setovan
    name?: string;
   items?: ArticleType[];

}