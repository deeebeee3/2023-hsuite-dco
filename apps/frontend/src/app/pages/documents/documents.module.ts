import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { DocumentsPageRoutingModule } from './documents-routing.module';
import { DocumentsPage } from './documents.page';

import { LanguageToggleModule } from 'src/app/components/languageToggle/language-toggle.module';
import { ThemeToggleModule } from 'src/app/components/themeToggle/theme-toggle.module';
import { NotificationService } from 'src/app/services/notification/notification.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DocumentsPageRoutingModule,
    TranslateModule,
    LanguageToggleModule,
    ThemeToggleModule,
  ],
  declarations: [DocumentsPage],
  providers: [NotificationService],
})
export class DocumentsPageModule {}
