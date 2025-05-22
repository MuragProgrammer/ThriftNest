export class Product {
    id?: string;
    name!: string;
    price!: number;
    currency?: string; // "PHP"
    category!: string;
    image!: string;
}
