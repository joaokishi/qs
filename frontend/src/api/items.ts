import api from './axios';
import type { Item } from '../types';

export interface CreateItemDto {
    title: string;
    description: string;
    startingPrice: number;
    minimumIncrement: number;
    categoryId: string;
    state: 'NEW' | 'USED' | 'REFURBISHED';
}

export const getItems = async (): Promise<Item[]> => {
    const response = await api.get<Item[]>('/items');
    return response.data;
};

export const getItem = async (id: string): Promise<Item> => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
};

export const createItem = async (data: CreateItemDto): Promise<Item> => {
    const response = await api.post<Item>('/items', data);
    return response.data;
};

export const updateItem = async (id: string, data: Partial<CreateItemDto>): Promise<Item> => {
    const response = await api.patch<Item>(`/items/${id}`, data);
    return response.data;
};

export const deleteItem = async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
};

export const uploadItemImage = async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/items/${id}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
