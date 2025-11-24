import api from './axios';
import type { Bid } from '../types';

export const placeBid = async (itemId: string, amount: number): Promise<Bid> => {
    const response = await api.post<Bid>('/bids', { itemId, amount });
    return response.data;
};

export const getMyBids = async (): Promise<Bid[]> => {
    const response = await api.get<Bid[]>('/bids/my-bids');
    return response.data;
};

export const getItemBids = async (itemId: string): Promise<Bid[]> => {
    const response = await api.get<Bid[]>(`/bids/item/${itemId}`);
    return response.data;
};
