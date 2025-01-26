import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eventService } from '../services/eventService';
import { useAuthStore } from '../stores/authStore';
import type { Event, EventRegistration } from '../types/event';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;
      try {
        const [eventData, registrationsData] = await Promise.all([
          eventService.getEvent(id),
          isAdmin ? eventService.getEventRegistrations(id) : Promise.resolve([]),
        ]);
        setEvent(eventData);
        setRegistrations(registrationsData);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    loadEventData();
  }, [id, navigate, isAdmin]);

  const handleRegister = async () => {
    if (!event?.id) return;
    try {
      await eventService.registerForEvent(event.id);
      toast.success('Successfully registered for the event!');
      // Refresh event details
      const updatedEvent = await eventService.getEvent(event.id);
      setEvent(updatedEvent);
    } catch (error) {
      toast.error('Failed to register for the event. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } catch (error) {
      toast.error('Failed to share the event.');
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Header */}
          <div className="relative">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            )}
            <div className="absolute top-4 right-4 space-x-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: event.category.color + '20', color: event.category.color }}
                >
                  {event.category.name}
                </span>
              </div>
              <p className="text-gray-600">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{new Date(event.date).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>{event.capacity - event.registeredCount} spots remaining</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">What's Included</h2>
            <ul className="space-y-3">
              {event.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Registrations (Admin Only) */}
          {isAdmin && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Registrations</h2>
              {registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            {registration.user.firstname} {registration.user.lastname}
                          </p>
                          <p className="text-sm text-gray-500">{registration.user.email}</p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${registration.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : registration.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {registration.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No registrations yet</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900">
                ${event.price}
              </div>
              <p className="text-sm text-gray-500 mt-1">per person</p>
            </div>

            <div className="space-y-4">
              {!isAdmin && (
                <button
                  onClick={handleRegister}
                  disabled={event.registeredCount >= event.capacity}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${event.registeredCount >= event.capacity
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {event.registeredCount >= event.capacity ? 'Sold Out' : 'Register Now'}
                </button>
              )}

              <div className="text-center text-sm text-gray-500">
                {event.capacity - event.registeredCount} spots remaining
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Organizer</h3>
              <div className="space-y-2">
                <p className="font-medium">{event.organizer.firstname} {event.organizer.lastname}</p>
                <p className="text-sm text-gray-500">{event.organizer.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};