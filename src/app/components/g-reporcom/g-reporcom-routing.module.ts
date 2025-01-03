import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GReporcomComponent } from './g-reporcom.component';

const routes: Routes = [{ path: '', component: GReporcomComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GReporcomRoutingModule { }
