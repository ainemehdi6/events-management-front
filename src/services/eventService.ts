import { api } from '../lib/api';
import type { Event, EventFormData, EventRegistration } from '../types/event';

export const eventService = {
  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async getEvent(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: EventFormData): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data;
  },

  async updateEvent(id: string, data: EventFormData): Promise<Event> {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async registerForEvent(id: string): Promise<void> {
    await api.post(`/events/${id}/register`);
  },

  async getEventRegistrations(id: string): Promise<EventRegistration[]> {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data;
  },

  async updateRegistrationStatus(
    eventId: string,
    registrationId: string,
    status: string
  ): Promise<EventRegistration> {
    const response = await api.put(`/events/${eventId}/registrations/${registrationId}`, {
      status,
    });
    return response.data;
  },
};