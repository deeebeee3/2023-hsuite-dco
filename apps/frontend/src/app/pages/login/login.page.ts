import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;

  email!: string;
  password!: string;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).then(() => {
      this.notificationService.showNotification('Login success', 2000, 'bottom', 'success');
    }).catch(error  => {
      if(error.message.includes('404')) {
        this.notificationService.showNotification('User not found', 5000, 'bottom', 'danger');
      }
      if(error.message.includes('400')) {
        this.notificationService.showNotification('Wrong password', 5000, 'bottom', 'danger');
      }
    })
  }


  ngOnInit() {
    this.translateService.setDefaultLang('en');
  }

}
