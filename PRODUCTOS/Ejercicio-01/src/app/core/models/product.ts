import { category } from "./category";
import { Rating } from "./rating";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: category;
    image: string;
    rating: Rating;
}