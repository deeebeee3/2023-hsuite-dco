import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountriesListPageRoutingModule } from './countries-list-routing.module';

import { CountriesListPage } from './countries-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountriesListPageRoutingModule
  ],
  declarations: [CountriesListPage]
})
export class CountriesListPageModule {}
