import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GProcesosComponent } from './g-procesos.component';
import { DetprocesosComponent } from './detprocesos/detprocesos.component';

const routes: Routes = [
  { path: '', component: GProcesosComponent,
    children:[
      { path: '', component: DetprocesosComponent },
      { path: 'detprocesos/:xestado', component : DetprocesosComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GProcesosRoutingModule { }
