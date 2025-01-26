import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { EventForm as EventFormComponent } from '../components/EventForm';
import { eventService } from '../services/eventService';
import type { EventFormData } from '../types/event';

const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Event date must be in the future',
    }),
    endDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: 'Event end date must be in the future',
    }),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    categoryId: z.string().min(1, 'Category is required'),
    status: z.enum(['draft', 'published', 'cancelled', 'completed']),
    price: z.number().min(0, 'Price cannot be negative'),
    imageUrl: z.string().url().optional(),
    features: z.array(z.string()),
});

export const EventFormPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: EventFormData, setErrors: (errors: Record<string, string>) => void) => {
        setLoading(true);
        try {
            const validatedData = eventSchema.parse(data);
            await eventService.createEvent(validatedData);
            toast.success('Event created successfully!');
            navigate('/events');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce((acc, err) => {
                    if (err.path[0]) {
                        acc[err.path[0].toString()] = err.message;
                    }
                    return acc;
                }, {} as Record<string, string>);
                setErrors(errors);
            } else {
                toast.error('Failed to create event. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/events');
    };

    return (
        <EventFormComponent
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
        />
    );
};
