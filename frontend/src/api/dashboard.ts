import api from './axios';

export interface DashboardMetrics {
    activeAuctions: number;
    totalRevenue: number;
    totalUsers: number;
}

export interface TopItem {
    id: string;
    title: string;
    bidCount: number;
    currentPrice: number;
}

export const getMetrics = async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
};

export const getTopItems = async (): Promise<TopItem[]> => {
    const response = await api.get<TopItem[]>('/dashboard/items/top-bids');
    return response.data;
};
