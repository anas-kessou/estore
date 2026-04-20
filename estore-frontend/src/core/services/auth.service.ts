import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';
import { User, AuthResponse, Profile } from '@/shared/types';

const STORAGE_KEY = 'auth_token';
const USER_KEY = 'current_user';
const AUTH_CHANGED_EVENT = 'auth-changed';

interface BackendAuthPayload {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const mapAuthPayloadToUser = (payload: BackendAuthPayload): User => ({
  id: payload.userId,
  email: payload.email,
  firstName: payload.firstName,
  lastName: payload.lastName,
  role: payload.role,
});

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const AuthService = {
  register: async (user: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_REGISTER, user);
      const payload = unwrapResponse<BackendAuthPayload>(response);
      const authResponse: AuthResponse = {
        token: payload.token,
        user: mapAuthPayloadToUser(payload),
      };

      localStorage.setItem(STORAGE_KEY, authResponse.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
      notifyAuthChange();

      return authResponse;
    } catch (error) {
      throw toApiError(error, 'Registration failed');
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });
      const payload = unwrapResponse<BackendAuthPayload>(response);
      const authResponse: AuthResponse = {
        token: payload.token,
        user: mapAuthPayloadToUser(payload),
      };

      localStorage.setItem(STORAGE_KEY, authResponse.token);
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
      notifyAuthChange();

      return authResponse;
    } catch (error) {
      throw toApiError(error, 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    notifyAuthChange();
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  getProfile: async (userId: number): Promise<User> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_PROFILE(userId));
      return unwrapResponse<User>(response);
    } catch (error) {
      throw toApiError(error, 'Failed to get profile');
    }
  },

  updateProfile: async (userId: number, profile: Partial<Profile>): Promise<User> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH_PROFILE(userId), profile);
      const data = unwrapResponse<User>(response);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      notifyAuthChange();
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update profile');
    }
  },
};

export { AUTH_CHANGED_EVENT };
