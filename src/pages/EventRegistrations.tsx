import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventService } from '../services/eventService';
import type { Event, EventRegistration } from '../types/event';

export const EventRegistrations: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [eventData, registrationsData] = await Promise.all([
                    eventService.getEvent(id),
                    eventService.getEventRegistrations(id),
                ]);
                setEvent(eventData);
                setRegistrations(registrationsData);
                console.log(registrationsData);
            } catch (error) {
                toast.error('Failed to load event data');
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleStatusUpdate = async (registrationId: string, newStatus: string) => {
        if (!id) return;
        try {
            await eventService.updateRegistrationStatus(id, registrationId, newStatus);
            const updatedRegistrations = await eventService.getEventRegistrations(id);
            setRegistrations(updatedRegistrations);
            toast.success('Registration status updated');
        } catch (error) {
            toast.error('Failed to update registration status');
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Events
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center text-gray-600 mb-6">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Capacity</p>
                        <p className="text-2xl font-semibold">{event.capacity}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Registered</p>
                        <p className="text-2xl font-semibold">{event.registeredCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Available Spots</p>
                        <p className="text-2xl font-semibold">{event.capacity - event.registeredCount}</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Registrations</h2>
                <div className="space-y-4">
                    {registrations.length > 0 ? (
                        registrations.map((registration) => (
                            <div
                                key={registration.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">
                                        {registration.user.firstname} {registration.user.lastname}
                                    </p>
                                    <p className="text-sm text-gray-500">{registration.user.email}</p>
                                    <p className="text-xs text-gray-400">
                                        Registered on: {new Date(registration.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                                            disabled={registration.status === 'confirmed'}
                                            className="p-1 rounded-full hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Confirm registration"
                                        >
                                            <Check className="h-5 w-5 text-green-600" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                                            disabled={registration.status === 'cancelled'}
                                            className="p-1 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Cancel registration"
                                        >
                                            <X className="h-5 w-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No registrations yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};