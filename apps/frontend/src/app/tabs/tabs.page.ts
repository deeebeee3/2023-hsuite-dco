import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController, private translateService: TranslateService) {}

  userAdmin: Promise<boolean> = this.authService.isUserAdmin();

  async logout() {
    const alert = await this.alertController.create({
      header: this.translateService.instant('LOGOUT.LOGOUT_ALERT.CONFIRMATION'),
      message: this.translateService.instant('LOGOUT.LOGOUT_ALERT.LOGOUT_CONFIRMATION'),
      buttons: [
        {
          text: this.translateService.instant('LOGOUT.LOGOUT_ALERT.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('LOGOUT.LOGOUT_ALERT.LOGOUT'),
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

}
