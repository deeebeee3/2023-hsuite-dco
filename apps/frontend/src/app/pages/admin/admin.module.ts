import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminPage } from './admin.page';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { Storage } from '@ionic/storage';

import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    TranslateModule,
    LanguageToggleModule,
    ThemeToggleModule,
  ],
  declarations: [AdminPage],
  providers: [LanguageService, Storage],
})
export class AdminPageModule {}
