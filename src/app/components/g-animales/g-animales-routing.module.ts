import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GAnimalesComponent } from './g-animales.component';
import { DetanimalesComponent } from './detanimales/detanimales.component';

const routes: Routes = [
  { path: '', component: GAnimalesComponent,
children :[
  {path :'', component : DetanimalesComponent},
  {path : 'detanimales/:estado', component: DetanimalesComponent}

]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GAnimalesRoutingModule { }
