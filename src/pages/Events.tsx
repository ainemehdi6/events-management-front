import React, { useState, useEffect } from 'react';
import { EventList } from '../components/EventList';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../services/eventService';
import { useAuthStore } from '../stores/authStore';
import type { Event } from '../types/event';
import axios from 'axios';

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  const loadEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      await eventService.registerForEvent(eventId);
      toast.success('Successfully registered for the event!');
      await loadEvents();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('Already registered for this event');
      } else {
        toast.error('Failed to register for the event. Please try again.');
      }
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    try {
      await eventService.cancelRegistration(eventId);
      toast.success('Successfully cancelled registration');
      await loadEvents();
    } catch (error) {
      toast.error('Failed to cancel registration. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        {isAdmin && (
          <button
            onClick={() => navigate('/events/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        )}
      </div>
      <EventList
        events={events}
        onRegister={handleRegister}
        onCancelRegistration={handleCancelRegistration}
        loading={loading}
      />
    </div>
  );
};
