import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const isAdmin = await this.authService.isUserAdmin();
        resolve(isAdmin);
      } catch (error) {
        console.error(error);
        resolve(false);
      }
    });
  }
}
