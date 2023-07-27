import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminFormPage } from './admin-form.page';

const routes: Routes = [
  {
    path: '',
    component: AdminFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminFormPageRoutingModule {}
