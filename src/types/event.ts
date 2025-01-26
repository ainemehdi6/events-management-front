import { Uuid } from './common';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface EventCategory {
  id: Uuid;
  name: string;
  description?: string;
  color: string;
}

export interface EventRegistration {
  id: Uuid;
  event: Event;
  user: {
    id: Uuid;
    firstname: string;
    lastname: string;
    email: string;
  };
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: Uuid;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  capacity: number;
  registeredCount: number;
  category: EventCategory;
  status: EventStatus;
  imageUrl?: string;
  price: number;
  organizer: {
    id: Uuid;
    firstname: string;
    lastname: string;
    email: string;
  };
  features: string[];
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  capacity: number;
  categoryId: Uuid;
  status: EventStatus;
  price: number;
  imageUrl?: string;
  features: string[];
}