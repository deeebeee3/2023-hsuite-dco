import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { routes, TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { Storage } from '@ionic/storage';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    TranslateModule
  ],
  declarations: [TabsPage],
  providers: [LanguageService, Storage],
})
export class TabsPageModule {}
