import React from 'react';
import { Calendar, MapPin, Users, Check, Clock, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import type { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onCancelRegistration?: () => void;
  showRegisterButton?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onCancelRegistration,
  showRegisterButton = true,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');
  const isFullyBooked = event.registeredCount >= event.capacity;
  const availableSpots = event.capacity - event.registeredCount;
  const isRegistered = event.isRegistered;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          <div className="flex items-center space-x-2">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${event.category.color}20`,
                color: event.category.color
              }}
            >
              {event.category.name}
            </span>
            {isRegistered && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Registered
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-5 w-5 mr-2" />
            <span>
              {new Date(event.date).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="h-5 w-5 mr-2" />
            <span>
              {isAdmin ? (
                `${event.registeredCount}/${event.capacity} registered`
              ) : (
                `${availableSpots} spot${availableSpots !== 1 ? 's' : ''} remaining`
              )}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {isAdmin ? (
            <Link
              to={`/events/${event.id}/registrations`}
              className="block w-full px-4 py-2 text-center rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              View Registrations
            </Link>
          ) : (
            <>
              {showRegisterButton && !isRegistered && (
                <button
                  onClick={onRegister}
                  disabled={isFullyBooked}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium ${isFullyBooked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {isFullyBooked ? 'Fully Booked' : 'Register Now'}
                </button>
              )}
              {isRegistered && (
                <div className="space-y-2">
                  <div className="text-center text-sm text-gray-500">
                    You're registered for this event
                  </div>
                  <button
                    onClick={onCancelRegistration}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4 inline-block mr-1" />
                    Cancel Registration
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
