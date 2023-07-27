import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Storage } from '@ionic/storage';

import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    TranslateModule,
    LanguageToggleModule,
    ThemeToggleModule,
  ],
  declarations: [LoginPage],
  providers: [LanguageService, Storage, NotificationService],
})
export class LoginPageModule {}
