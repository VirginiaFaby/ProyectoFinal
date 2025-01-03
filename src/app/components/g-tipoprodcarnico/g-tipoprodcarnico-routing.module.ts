import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GTipoprodcarnicoComponent } from './g-tipoprodcarnico.component';
import { DettipoprodcarnicoComponent } from './dettipoprodcarnico/dettipoprodcarnico.component';

const routes: Routes = [
  { path: '', component: GTipoprodcarnicoComponent ,
    children:[
      { path : '', component : DettipoprodcarnicoComponent},
      { path : 'dettipoprodcarnicos/xestado', component : DettipoprodcarnicoComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GTipoprodcarnicoRoutingModule { }
