import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

import { LanguageService } from 'src/app/services/language/language.service';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TranslateModule,
    LanguageToggleModule,
    ThemeToggleModule,
  ],
  declarations: [DashboardPage],
  providers: [LanguageService],
})
export class DashboardPageModule {}
