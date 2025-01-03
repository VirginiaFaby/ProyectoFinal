import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GEntregaprodcComponent } from './g-entregaprodc.component';
import { DetentregaprodcComponent } from './detentregaprodc/detentregaprodc.component';

const routes: Routes = [
  { path: '', component: GEntregaprodcComponent,
  children:[
    { path : '', component : DetentregaprodcComponent},
    { path : 'detentregaprodc/:estado', component : DetentregaprodcComponent }
  ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GEntregaprodcRoutingModule { }
