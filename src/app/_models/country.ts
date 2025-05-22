export interface Country {
    name: string;
    shippingFee: number;
    phoneCode?: string; // optional if some countries might not have it
}

