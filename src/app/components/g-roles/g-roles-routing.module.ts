import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GRolesComponent } from './g-roles.component';
import { DetrolesComponent } from './detroles/detroles.component';

const routes: Routes = [
  { path: '', component: GRolesComponent,
  children: [
    { path: '', component: DetrolesComponent},
    { path: 'detroles/xestado', component: DetrolesComponent}
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GRolesRoutingModule { }
