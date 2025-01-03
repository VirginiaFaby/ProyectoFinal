import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GReporvenComponent } from './g-reporven.component';

const routes: Routes = [{ path: '', component: GReporvenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GReporvenRoutingModule { }
