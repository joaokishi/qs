import api from './axios';

export interface DashboardMetrics {
    activeAuctions: number;
    totalRevenue: number;
    totalUsers: number;
}

import type { Item } from '../types';

export interface TopItem {
    item: Item;
    bidCount: number;
    highestBid: number;
}

export const getMetrics = async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
};

export const getTopItems = async (): Promise<TopItem[]> => {
    const response = await api.get<TopItem[]>('/dashboard/items/top-bids');
    return response.data;
};
