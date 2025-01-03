import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GMenusComponent } from './g-menus.component';
import { DetmenusComponent } from './detmenus/detmenus.component';


const routes: Routes = [
  { path: '', component: GMenusComponent,
  children:[
    { path: '', component: DetmenusComponent},
    { path: 'detmenus/:xestado', component: DetmenusComponent}
  ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMenusRoutingModule { }
