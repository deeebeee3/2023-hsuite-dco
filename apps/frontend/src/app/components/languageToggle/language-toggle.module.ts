import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LanguageToggleComponent } from './language-toggle.component';

@NgModule({
  declarations: [LanguageToggleComponent],
  imports: [CommonModule, IonicModule],
  exports: [LanguageToggleComponent]
})
export class LanguageToggleModule { }
