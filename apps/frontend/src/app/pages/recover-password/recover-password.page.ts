import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage {
  recoverPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.recoverPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async recoverPassword() {
    this.submitted = true;
    const email = this.recoverPasswordForm.controls['email'].value;

    // You can add your password recovery logic here
    // For now, let's just show a toast message
    const toast = await this.toastController.create({
      message: this.translateService.instant('RECOVER_PASSWORD_TOAST_MESSAGE', { email }),
      duration: 5000,
      position: 'middle'
    });
    toast.present();

    this.submitted = false;
    this.router.navigate(['/login']);
  }
}
