import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GPersonasRoutingModule } from './g-personas-routing.module';
import { GPersonasComponent } from './g-personas.component';
import { DetpersonasComponent } from './detpersonas/detpersonas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GPersonasComponent, 
    DetpersonasComponent
  ],
  imports: [
    CommonModule,
    GPersonasRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GPersonasModule { }
