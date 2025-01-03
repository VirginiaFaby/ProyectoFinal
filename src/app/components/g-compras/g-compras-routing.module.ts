import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GComprasComponent } from './g-compras.component';
import { DetcomprasComponent } from './detcompras/detcompras.component';

const routes: Routes = [
  { path: '', component: GComprasComponent,
  children:[
    { path: '', component: DetcomprasComponent},
    { path: 'detCompras/xestado', component: DetcomprasComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GComprasRoutingModule { }
