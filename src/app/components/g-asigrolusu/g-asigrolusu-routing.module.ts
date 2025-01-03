import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GAsigrolusuComponent } from './g-asigrolusu.component';

const routes: Routes = [{ path: '', component: GAsigrolusuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GAsigrolusuRoutingModule { }
