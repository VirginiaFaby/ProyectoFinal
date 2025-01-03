import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GAsigmeproComponent } from './g-asigmepro.component';

const routes: Routes = [{ path: '', component: GAsigmeproComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GAsigmeproRoutingModule { }
