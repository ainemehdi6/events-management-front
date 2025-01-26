import { api } from '../lib/api';
import type { EventCategory } from '../types/event';

export const categoryService = {
  async getCategories(): Promise<EventCategory[]> {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getCategory(id: string): Promise<EventCategory> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data: Omit<EventCategory, 'id'>): Promise<EventCategory> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: Omit<EventCategory, 'id'>): Promise<EventCategory> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};