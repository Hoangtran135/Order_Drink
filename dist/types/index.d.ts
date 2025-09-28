export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    address: string;
}
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    available: boolean;
}
export interface CartItem {
    productId: number;
    quantity: number;
    product?: Product;
}
export interface Order {
    id: number;
    userId: number;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    createdAt: Date;
    deliveryAddress: string;
    phone: string;
}
export interface SessionData {
    userId?: number;
    username?: string;
    cart?: CartItem[];
}
//# sourceMappingURL=index.d.ts.map