import api from './axios';
import type { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (name: string, description: string): Promise<Category> => {
    const response = await api.post<Category>('/categories', { name, description });
    return response.data;
};

export const updateCategory = async (id: string, name: string, description: string): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, { name, description });
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
};
