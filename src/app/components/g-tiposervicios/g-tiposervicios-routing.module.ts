import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GTiposerviciosComponent } from './g-tiposervicios.component';
import { DettiposerviciosComponent } from './dettiposervicios/dettiposervicios.component';

const routes: Routes = [
  { path: '', component: GTiposerviciosComponent,
children: [
  { path : '', component: DettiposerviciosComponent},
  { path : 'dettiposervicios/xestado', component: DettiposerviciosComponent}
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GTiposerviciosRoutingModule { }
