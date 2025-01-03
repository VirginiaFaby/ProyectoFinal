import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GCorralesComponent } from './g-corrales.component';
import { DetcorralesComponent } from './detcorrales/detcorrales.component';

const routes: Routes = [
  { path: '', component: GCorralesComponent,
children:[
  {path : '', component: DetcorralesComponent}, 
  { path:'detcorrales/:estado', component:DetcorralesComponent}
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GCorralesRoutingModule { }
