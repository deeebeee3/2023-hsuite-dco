import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';

import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { Storage } from '@ionic/storage';
import { NotificationService } from 'src/app/services/notification/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    ProfilePageRoutingModule,
    TranslateModule,
    LanguageToggleModule,
    ThemeToggleModule,
  ],
  declarations: [ProfilePage],
  providers: [LanguageService, Storage, NotificationService],
})
export class ProfilePageModule {}
