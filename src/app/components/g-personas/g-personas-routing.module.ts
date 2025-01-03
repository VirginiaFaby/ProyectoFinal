import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GPersonasComponent } from './g-personas.component';
import { DetpersonasComponent } from './detpersonas/detpersonas.component';

const routes: Routes = [
  { path: '', component: GPersonasComponent,
    children:[
      { path : '', component: DetpersonasComponent },
      { path : 'detpersonas/xestado', component: DetpersonasComponent}
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GPersonasRoutingModule { }
