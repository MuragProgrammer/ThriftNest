export class Order {
    id?: string; // Auto-generated order ID
    userId!: string;
    contactEmail!: string;
    items!: {
        productId: string;
        productName: string;
        quantity: number;
    }[];
    totalAmount!: number;
    orderDate!: string; // ISO string
    status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';

    shipping!: {
        fullname: string;
        address: string;
        city: string;
        state: string;
        country: string;
    };
}
