import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GServiciofaenaComponent } from './g-serviciofaena.component';
import { DetserviciofaenaComponent } from './detserviciofaena/detserviciofaena.component';

const routes: Routes = [
  { path: '', component: GServiciofaenaComponent,
    children: [
      { path: '', component:DetserviciofaenaComponent },
      { path: 'detServiciofaena/xestado', component: DetserviciofaenaComponent }
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GServiciofaenaRoutingModule { }
