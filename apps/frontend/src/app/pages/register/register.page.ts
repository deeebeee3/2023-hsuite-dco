import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.minLength(8)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.notificationService.showNotification('Passwords do not match', 5000, 'bottom', 'danger');
        return;
      }

      this.authService.register({ email: this.registerForm.value.email, password: this.registerForm.value.password })
      .then(() => {
        this.notificationService.showNotification('Registration success', 2000, 'bottom', 'success');
      }).catch(error => {
        if (error.message.includes('400')) {
          this.notificationService.showNotification('User already exists', 5000, 'bottom', 'danger');
        }else if (error.message.includes('500')) {
          this.notificationService.showNotification('Internal server error', 5000, 'bottom', 'danger');
        }
      });
    } else {
      this.notificationService.showNotification('Failed to Register. Try again later', 5000, 'bottom', 'danger');
    }
  }


}
