import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GClientesComponent } from './g-clientes.component';
import { DetclientesComponent } from './detclientes/detclientes.component';

const routes: Routes = [
  { path: '', component: GClientesComponent, 
  children:[
    {path: '', component: DetclientesComponent},
    {path: 'detclientes/:estado', component: DetclientesComponent},
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GClientesRoutingModule { }
