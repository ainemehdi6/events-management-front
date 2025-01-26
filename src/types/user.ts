export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstname: string;
  lastname: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserProfile extends User {
  phone?: string;
  organization?: string;
  bio?: string;
  avatarUrl?: string;
  preferences: {
    emailNotifications: boolean;
    eventReminders: boolean;
    newsletterSubscription: boolean;
  };
}
