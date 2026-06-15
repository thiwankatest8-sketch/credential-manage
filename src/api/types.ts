import type { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface GetMeResponse {
  user: User;
}
