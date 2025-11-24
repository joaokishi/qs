export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'participant';
    isBlocked?: boolean;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    initialValue: string | number;
    currentValue: string | number;
    minimumIncrement: string | number;
    images: string[];
    condition: string;
    categoryId: string;
    auctionId?: string;
    category?: Category;
}

export interface Auction {
    id: string;
    title: string;
    status: 'agendado' | 'ativo' | 'concluido' | 'cancelado';
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    items: Item[];
    currentItemId?: string;
}

export interface Bid {
    id: string;
    amount: number;
    createdAt: string;
    userId: string;
    itemId: string;
    user?: User;
    item?: Item;
}
