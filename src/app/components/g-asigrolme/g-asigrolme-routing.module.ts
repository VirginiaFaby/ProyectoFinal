import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GAsigrolmeComponent } from './g-asigrolme.component';

const routes: Routes = [{ path: '', component: GAsigrolmeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GAsigrolmeRoutingModule { }
