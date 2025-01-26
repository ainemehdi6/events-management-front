import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { eventService } from '../services/eventService';
import type { Event } from '../types/event';
import toast from 'react-hot-toast';
import axios from 'axios';

export const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error('Already registered for this event');
        } else {
          toast.error('Failed to register for the event. Please try again.');
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalRegistrations = events.reduce((acc, event) => acc + event.registeredCount, 0);
  const upcomingEventsCount = events.filter(event => new Date(event.date) > new Date()).length;

  const stats = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      icon: <Calendar className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: 'Total Registrations',
      value: totalRegistrations.toString(),
      icon: <Users className="h-6 w-6 text-green-600" />,
    },
    {
      title: 'Growth Rate',
      value: '+24%',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    },
    {
      title: 'Upcoming Events',
      value: upcomingEventsCount.toString(),
      icon: <Clock className="h-6 w-6 text-purple-600" />,
    },
  ];

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
          <Link
            to="/events"
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => handleRegister(event.id)}
                onCancelRegistration={() => handleCancelRegistration(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};
