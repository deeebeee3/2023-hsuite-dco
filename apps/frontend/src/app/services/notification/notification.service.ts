import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastController: ToastController) { }

  async showNotification(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'bottom', color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      color: color,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
