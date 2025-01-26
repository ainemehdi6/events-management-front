import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Mail, Lock, User, ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { LoadingButton } from '../components/LoadingButton';
import type { ApiError } from '../types/auth';
import axios from 'axios';

const passwordRequirements = {
    minLength: 'At least 8 characters',
    uppercase: 'At least one uppercase letter',
    lowercase: 'At least one lowercase letter',
    number: 'At least one number',
    special: 'At least one special character (@$!%*?&)',
} as const;

const registerSchema = z.object({
    firstname: z.string().min(2, 'First name must be at least 2 characters'),
    lastname: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, passwordRequirements.minLength)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const checkPasswordRequirement = (requirement: RegExp): boolean => {
        return requirement.test(formData.password);
    };

    const passwordStrength = {
        minLength: formData.password.length >= 8,
        uppercase: checkPasswordRequirement(/[A-Z]/),
        lowercase: checkPasswordRequirement(/[a-z]/),
        number: checkPasswordRequirement(/[0-9]/),
        special: checkPasswordRequirement(/[@$!%*?&]/),
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const validatedData = registerSchema.parse(formData);
            const { confirmPassword, ...registrationData } = validatedData;
            await authService.register(registrationData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if (axios.isAxiosError(error) && error.response) {
                const apiError = error.response.data as ApiError;
                if (apiError.invalidParams) {
                    const newErrors: Record<string, string> = {};
                    apiError.invalidParams.forEach((param) => {
                        newErrors[param.name] = param.reason;
                    });
                    setErrors(newErrors);
                }
                toast.error(apiError.title || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-8"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to login
                    </Link>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us to start managing and attending events
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstname" className="sr-only">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        required
                                        className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.firstname ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        placeholder="First Name"
                                        value={formData.firstname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, firstname: e.target.value })
                                        }
                                    />
                                </div>
                                {errors.firstname && (
                                    <p className="mt-2 text-sm text-red-600">{errors.firstname}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastname" className="sr-only">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        required
                                        className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.lastname ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        placeholder="Last Name"
                                        value={formData.lastname}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastname: e.target.value })
                                        }
                                    />
                                </div>
                                {errors.lastname && (
                                    <p className="mt-2 text-sm text-red-600">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}

                            {/* Password Requirements */}
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                                <ul className="space-y-1">
                                    {Object.entries(passwordRequirements).map(([key, text]) => (
                                        <li
                                            key={key}
                                            className={`text-sm flex items-center space-x-2 ${passwordStrength[key as keyof typeof passwordStrength]
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            <Check
                                                className={`h-4 w-4 ${passwordStrength[key as keyof typeof passwordStrength]
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                    }`}
                                            />
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div>
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Create Account
                            </LoadingButton>
                        </div>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};