import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GGuiasenasagComponent } from './g-guiasenasag.component';
import { DetguiasenasagComponent } from './detguiasenasag/detguiasenasag.component';

const routes: Routes = [
  { path: '', component: GGuiasenasagComponent,
children: [
  {path : '', component: DetguiasenasagComponent},
  {path : 'detguiasenasag/:estado', component:DetguiasenasagComponent}
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GGuiasenasagRoutingModule { }
