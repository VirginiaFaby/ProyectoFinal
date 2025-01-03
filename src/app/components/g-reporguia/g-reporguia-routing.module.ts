import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GReporguiaComponent } from './g-reporguia.component';

const routes: Routes = [{ 
  path: '', component: GReporguiaComponent
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GReporguiaRoutingModule { }
