import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileForm: FormGroup = new FormGroup({});

  currentLanguage: string;
  isFormDifferent: boolean = false;
  passwordVisible: boolean = false;

  storedUserEmail: string | null = '';
  formUserEmail: string | null = '';
  formUserPassword: string | null = '';

  constructor(
    private languageService: LanguageService,
    private alertController: AlertController,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.currentLanguage = this.languageService.selected;
    this.storedUserEmail = localStorage.getItem('email');
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      email: [this.formUserEmail, Validators.email],
      password: [Validators.minLength(8)],
    });
  }

  onInputChange() {
    if (this.formUserEmail !== '' && this.profileForm.valid || this.formUserPassword !== '' && this.profileForm.valid) {
      this.isFormDifferent = true;
    } else {
      this.isFormDifferent = false;
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  updateProfile(): Promise<any> {
    if (this.profileForm.valid) {
      let profileUpdated = {};

      if (this.formUserEmail !== '') profileUpdated = { ...profileUpdated, email: this.formUserEmail };
      if (this.formUserPassword !== '') profileUpdated = { ...profileUpdated, password: this.formUserPassword };

      return new Promise(async (resolve, reject) => {
        try {

          let response = await axios.patch(`${environment.backendUrl}/users`, profileUpdated, {
            withCredentials: true,
            params: {
              email: `${localStorage.getItem('email')}`
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          });

          if (response.status === 200) {
            if (this.formUserEmail !== null) localStorage.setItem('email', this.formUserEmail);
            this.storedUserEmail = localStorage.getItem('email');
            this.isFormDifferent = false;

            this.formUserEmail = '';
            this.formUserPassword = '';

            return this.notificationService.showNotification('Profile updated successfully', 2000, 'top', 'success');
          } else {
            return this.notificationService.showNotification('Error updating profile, please try again later', 2000, 'top', 'danger');
          }
        } catch (error: any) {
          if (error.message == 'Network Error') {
            this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
          } else this.notificationService.showNotification('Something went wrong, please try refreshing the page', 2000, 'top', 'danger');
        }
      });
    } else {
      return this.notificationService.showNotification('Invalid Form', 2000, 'bottom', 'danger');
    }
  }


  async deleteAccount(): Promise<any> {
    const alert = await this.alertController.create({
      header: this.translate.instant('PROFILE.DELETE_ACCOUNT_ALERT.HEADER'),
      message: this.translate.instant('PROFILE.DELETE_ACCOUNT_ALERT.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('PROFILE.DELETE_ACCOUNT_ALERT.CANCEL_BUTTON'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('PROFILE.DELETE_ACCOUNT_ALERT.DELETE_BUTTON'),
          handler: async () => {
            try {
              const response = await axios.delete(`${environment.backendUrl}/users`, {
                withCredentials: true,
                params: {
                  email: `${localStorage.getItem('email')}`
                },
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
              });
              if (response.status === 200) {
                localStorage.removeItem('email');
                localStorage.removeItem('token');

                window.location.reload();
                return this.notificationService.showNotification('Account deleted successfully', 2000, 'bottom', 'success');
              } else {
                return this.notificationService.showNotification('Error deleting account, please try again later', 2000, 'top', 'danger');
              }
            } catch (error: any) {
              if (error.message == 'Network Error') {
                this.notificationService.showNotification('Server is down, please try again later', 2000, 'top', 'danger');
              } else this.notificationService.showNotification('Something went wrong, please try refreshing the page', 2000, 'top', 'danger');
            }
          }
        }
      ]
    });
    alert.present();
  }

  goToAdminPage() {
    window.location.href = 'tabs/admin';
  }


}
