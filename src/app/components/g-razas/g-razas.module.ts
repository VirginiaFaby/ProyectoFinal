import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GRazasRoutingModule } from './g-razas-routing.module';
import { GRazasComponent } from './g-razas.component';
import { DetrazasComponent } from './detrazas/detrazas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GRazasComponent, 
    DetrazasComponent
  ],
  imports: [
    CommonModule,
    GRazasRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule

  ]
})
export class GRazasModule { }
