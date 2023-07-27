import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { LanguagePopoverPage } from '../../pages/language-popover/language-popover.page';

@Component({
  selector: 'language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss']
})
export class LanguageToggleComponent {
  constructor(private popoverCtrl: PopoverController) {}

  async openLanguagePopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev,
    });
    await popover.present();
  }
}
