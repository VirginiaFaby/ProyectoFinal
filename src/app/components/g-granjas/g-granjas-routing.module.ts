import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GGranjasComponent } from './g-granjas.component';
import { DetgranjasComponent } from './detgranjas/detgranjas.component';

const routes: Routes = [
  { path: '', component: GGranjasComponent,
children:[
  { path : '', component: DetgranjasComponent},
  { path : 'detgranjas/xestado', component: DetgranjasComponent}
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GGranjasRoutingModule { }
