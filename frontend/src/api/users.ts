import api from './axios';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

export const blockUser = async (id: string): Promise<void> => {
    await api.post(`/users/${id}/block`);
};

export const unblockUser = async (id: string): Promise<void> => {
    await api.post(`/users/${id}/unblock`);
};
