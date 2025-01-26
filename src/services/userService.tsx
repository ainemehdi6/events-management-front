import { api } from '../lib/api';
import type { UserProfile, UpdateProfileData } from '../types/user';

export const userService = {
    async getProfile(): Promise<UserProfile> {
        const response = await api.get('/profile');
        return response.data;
    },

    async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
        const response = await api.put('/profile', data);
        return response.data;
    },

    async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
        await api.put('/profile/password', data);
    },
};
