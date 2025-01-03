import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GReporserfaeComponent } from './g-reporserfae.component';

const routes: Routes = [{ 
  path: '', component: GReporserfaeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GReporserfaeRoutingModule { }
