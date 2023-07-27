import { AuthService } from './auth.service';
import axios from 'axios';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let authService: AuthService;
  let router: jest.Mocked<Router>;
  let notificationService: jest.Mocked<NotificationService>;
  let http: jest.Mocked<HttpClient>;

  beforeEach(() => {
    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    notificationService = {
      showNotification: jest.fn(),
    } as unknown as jest.Mocked<NotificationService>;

    authService = new AuthService(router, notificationService, http);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Register Method Tests
  it('should create a user successfully and navigate to login', async () => {
    const data = { email: 'test@test.com', password: 'password' };
    mockedAxios.post.mockResolvedValue({ status: 201, data: {} });

    const result = await authService.register(data);

    expect(mockedAxios.post).toHaveBeenCalledWith(`${environment.backendUrl}/auth/signup`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual({});
  });

  it('should reject with an error when user already exists', async () => {
    const data = { email: 'test@test.com', password: 'password' };
    mockedAxios.post.mockResolvedValue({ status: 409 });

    try {
      await authService.register(data);
    } catch (e: any) {
      expect(e.message).toEqual('Error: 409 - User already exists');
    }
  });

  // Login Method Tests
  it('should login successfully and navigate to tabs', async () => {
    const data = { username: 'test@test.com', password: 'password' };
    mockedAxios.post.mockResolvedValue({ status: 201, data: { jwt: { access_token: 'token' }, user: { userId: '123' } } });

    const result = await authService.login(data);

    expect(mockedAxios.post).toHaveBeenCalledWith(`${environment.backendUrl}/auth/login`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(localStorage.getItem('token')).toEqual('token');
    expect(localStorage.getItem('email')).toEqual(data.username);
    expect(localStorage.getItem('userId')).toEqual('123');
    expect(router.navigate).toHaveBeenCalledWith(['/tabs']);
    expect(result).toEqual({ jwt: { access_token: 'token' }, user: { userId: '123' } });
  });

  it('should reject with an error when user is not found', async () => {
    const data = { username: 'error@test.com', password: 'password' };
    mockedAxios.post.mockResolvedValue({ status: 404 });

    try {
      await authService.login(data);
    } catch (e: any) {
      expect(e.message).toEqual('Error: 404 - User not found');
    }
  });

  it('should reject with an error when password is wrong', async () => {
    const data = { username: 'test@test.com', password: 'wrongpassword' };
    mockedAxios.post.mockResolvedValue({ status: 400 });

    try {
      await authService.login(data);
    } catch (e: any) {
      expect(e.message).toEqual('Error: 400 - Wrong password');
    }
  });

  // Logout Method Tests
  it('should remove token, email and userId from localStorage and navigate to login', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('email', 'test@test.com');
    localStorage.setItem('userId', '123');

    authService.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // IsAuthenticated Method Tests
  it('should resolve to true when user is authenticated', async () => {
    localStorage.setItem('email', 'test@test.com');
    localStorage.setItem('token', 'token');
    mockedAxios.get.mockResolvedValue({ status: 200 });

    const result = await authService.isAuthenticated();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${environment.backendUrl}/users`, {
      withCredentials: true,
      params: { email: 'test@test.com' },
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    });
    expect(result).toBe(true);
  });

  it('should resolve to false when user is not authenticated', async () => {
    localStorage.removeItem('email');

    const result = await authService.isAuthenticated();

    expect(result).toBe(false);
    });

    it('should return user data when user is authenticated', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('token', 'token');
      mockedAxios.get.mockResolvedValue({ status: 200, data: { name: 'John', email: 'test@test.com', role: 'USER' } });

      const result = await authService.getUser();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${environment.backendUrl}/users`, {
        withCredentials: true,
        params: { email: 'test@test.com' },
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
      });
      expect(result).toEqual({ name: 'John', email: 'test@test.com', role: 'USER' });
    });

    // IsUserAdmin Method Tests
    it('should resolve to true when user is an admin', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('token', 'token');
      mockedAxios.get.mockResolvedValue({ status: 200, data: { name: 'John', email: 'test@test.com', role: 'ADMIN' } });

      const result = await authService.isUserAdmin();

      expect(result).toBe(true);
    });

    it('should resolve to false when user is not an admin', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('token', 'token');
      mockedAxios.get.mockResolvedValue({ status: 200, data: { name: 'John', email: 'test@test.com', role: 'USER' } });

      const result = await authService.isUserAdmin();

      expect(result).toBe(false);
    });
});
