import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

  async login(data: { username: string, password: string }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axios.post(`${environment.backendUrl}/auth/login`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 201) {
          console.log('response', response, 'data', data);
          localStorage.setItem('token', response.data.jwt.access_token);
          localStorage.setItem('email', data.username);
          localStorage.setItem('userId', response.data.user.userId);

          this.router.navigate(['/tabs']);
          resolve(response.data);
        } else {
          if (response.status === 404) {
            reject(new Error(`Error: ${response.status} - User not found`));
          }
          if (response.status === 400) {
            reject(new Error(`Error: ${response.status} - Wrong password`));
          }
          reject(new Error(`Error: ${response.status} - error on login service`));
        }

      } catch (error: any) {
        if (error.message == 'Network Error') {
          this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
        } else this.notificationService.showNotification('Unauthorized, please make sure you have entered the correct username and password', 2000, 'top', 'danger');

      }

    });
  }


  async register(data: { email: string, password: string }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axios.post(`${environment.backendUrl}/auth/signup`, data, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json', }
        });

        if (response.status === 201) {
          this.router.navigate(['/login']);
          resolve(response.data);
        } else {
          reject(new Error(`Error: ${response.status} - User already exists`));
        }

      } catch (error: any) {
        if (error.message == 'Network Error') {
          this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
        } else this.notificationService.showNotification('Something went wrong, please try again', 2000, 'top', 'danger');

      }
    });
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  async isAuthenticated(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (localStorage.getItem('email') === null) return resolve(false);

        let response = await axios.get(`${environment.backendUrl}/users`, {
          withCredentials: true,
          params: {
            email: `${localStorage.getItem('email')}`
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 200) resolve(true);
        else resolve(false);

      } catch (error) {
        if (error instanceof Error && error.message === 'Network Error') {
          this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
        }
        this.notificationService.showNotification('Please login', 2000, 'top', 'danger');
      }
    });
  }

  getUser(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axios.get(`${environment.backendUrl}/users`, {
          withCredentials: true,
          params: {
            email: `${localStorage.getItem('email')}`
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 200) resolve(response.data);

      } catch (error: any) {
        if (error.message == 'Network Error') {
          this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
        } else this.notificationService.showNotification('Something went wrong, please try refreshing the page', 2000, 'top', 'danger');
      }
    })
  }

  isUserAdmin(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await this.getUser();
        if (user.role === 'ADMIN') {
          resolve(true);
        }
        else {
          resolve(false);
        }
      } catch (error: any) {
        if (error.message == 'Network Error') {
          this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
        } else this.notificationService.showNotification('Something went wrong, please try refreshing the page', 2000, 'top', 'danger');

      }
    });
  }

}
