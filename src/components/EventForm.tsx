import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Calendar, MapPin, Users, Image, FileText, Clock, DollarSign, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import type { EventCategory, EventFormData } from '../types/event';
import { categoryService } from '../services/categoryService';

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

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData, setErrors: (errors: Record<string, string>) => void) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      capacity: 1,
      categoryId: '',
      status: 'draft',
      price: 0,
      imageUrl: '',
      features: [],
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<EventCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = eventSchema.parse(formData);
      await onSubmit(validatedData, setErrors);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const inputClasses = "pl-12 py-3 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
  const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";
  const sectionClasses = "bg-white rounded-lg shadow-sm p-6 space-y-4";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-indigo-700">
          <h1 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="mt-2 text-indigo-100">
            Fill in the details below to {initialData ? 'update' : 'create'} your event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Event Title
                </label>
                <div className="relative">
                  <FileText className={iconClasses} />
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={inputClasses}
                    placeholder="Enter event title"
                  />
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base p-4"
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Date and Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className={labelClasses}>
                  Start Date & Time
                </label>
                <div className="relative">
                  <Calendar className={iconClasses} />
                  <input
                    type="datetime-local"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className={labelClasses}>
                  End Date & Time
                </label>
                <div className="relative">
                  <Clock className={iconClasses} />
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location and Capacity */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Location and Capacity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className={labelClasses}>
                  Location
                </label>
                <div className="relative">
                  <MapPin className={iconClasses} />
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={inputClasses}
                    placeholder="Enter event location"
                  />
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label htmlFor="capacity" className={labelClasses}>
                  Capacity
                </label>
                <div className="relative">
                  <Users className={iconClasses} />
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) })}
                    className={inputClasses}
                    placeholder="Enter event capacity"
                  />
                </div>
                {errors.capacity && (
                  <p className="mt-2 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>
            </div>
          </div>

          {/* Category and Price */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Category and Price
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="categoryId" className={labelClasses}>
                  Category
                </label>
                <div className="relative">
                  <Tag className={iconClasses} />
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (
                  <p className="mt-2 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className={labelClasses}>
                  Price
                </label>
                <div className="relative">
                  <DollarSign className={iconClasses} />
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className={inputClasses}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className={sectionClasses}>
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Event Image
            </h2>

            <div>
              <label htmlFor="imageUrl" className={labelClasses}>
                Image URL
              </label>
              <div className="relative">
                <Image className={iconClasses} />
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={inputClasses}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {errors.imageUrl && (
                <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>
              )}
              {formData.imageUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Event preview"
                    className="h-48 w-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
