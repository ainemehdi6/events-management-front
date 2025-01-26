import { Uuid } from './common';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface User {
  id: Uuid;
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  token_expiration: number;
  refresh_token: string;
  user_roles: string[];
  user: User;
}

export interface ValidationError {
  name: string;
  reason: string;
}

export interface ApiError {
  statusCode: number;
  instance: string;
  title: string;
  invalidParams?: ValidationError[];
}