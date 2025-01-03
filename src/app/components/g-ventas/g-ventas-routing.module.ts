import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GVentasComponent } from './g-ventas.component';
import { DetventasComponent } from './detventas/detventas.component';

const routes: Routes = [
  { path: '', component: GVentasComponent,
    children:[
      { path: '', component: DetventasComponent},
      { path: 'detventas/:xestado', component: DetventasComponent }
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GVentasRoutingModule { }
