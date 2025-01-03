import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GProdcarnicosComponent } from './g-prodcarnicos.component';
import { DetprodcarnicosComponent } from './detprodcarnicos/detprodcarnicos.component';

const routes: Routes = [
  { path: '', component: GProdcarnicosComponent,
    children:[
      { path: '', component: DetprodcarnicosComponent},
      { path: 'detprodcarnicos/:xestado', component: DetprodcarnicosComponent }
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GProdcarnicosRoutingModule { }
