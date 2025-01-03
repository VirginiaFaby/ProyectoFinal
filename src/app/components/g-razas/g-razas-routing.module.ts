import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GRazasComponent } from './g-razas.component';
import { DetrazasComponent } from './detrazas/detrazas.component';

const routes: Routes = [
  { path: '', component: GRazasComponent,
  
  children:[
    { path: '', component: DetrazasComponent},
    { path: 'detrazas/xestado', component: DetrazasComponent}
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GRazasRoutingModule { }
