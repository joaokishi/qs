import api from './axios';
import type { Auction } from '../types';

export interface CreateAuctionDto {
    title: string;
    startDate: string;
    expectedEndDate: string;
    itemIds: string[];
}

export const getAuctions = async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions');
    return response.data;
};

export const getAuction = async (id: string): Promise<Auction> => {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
};

export const createAuction = async (data: CreateAuctionDto): Promise<Auction> => {
    const response = await api.post<Auction>('/auctions', data);
    return response.data;
};

export const updateAuction = async (id: string, data: Partial<CreateAuctionDto>): Promise<Auction> => {
    const response = await api.patch<Auction>(`/auctions/${id}`, data);
    return response.data;
};

export const startAuction = async (id: string): Promise<void> => {
    await api.post(`/auctions/${id}/start`);
};

export const endAuction = async (id: string): Promise<void> => {
    await api.post(`/auctions/${id}/end`);
};

export const nextItem = async (id: string): Promise<void> => {
    await api.post(`/auctions/${id}/next`);
};
