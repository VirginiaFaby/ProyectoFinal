import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GReporaniComponent } from './g-reporani.component';

const routes: Routes = [{ path: '', component: GReporaniComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GReporaniRoutingModule { }
