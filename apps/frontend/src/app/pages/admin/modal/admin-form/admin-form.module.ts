import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminFormPageRoutingModule } from './admin-form-routing.module';
import { AdminFormPage } from './admin-form.page';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';
import { NotificationService } from 'src/app/services/notification/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AdminFormPageRoutingModule,
    LanguageToggleModule,
    ThemeToggleModule,
    TranslateModule,
  ],
  declarations: [AdminFormPage],
  providers: [NotificationService],
})
export class AdminFormPageModule {}
