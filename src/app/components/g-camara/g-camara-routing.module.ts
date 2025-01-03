import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GCamaraComponent } from './g-camara.component';
import { DetcamaraComponent } from './detcamara/detcamara.component';

const routes: Routes = [
  { path: '', component: GCamaraComponent,
  children: [
  { path : '', component: DetcamaraComponent },
  { path : ' detcamara/:estado', component : DetcamaraComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GCamaraRoutingModule { }
