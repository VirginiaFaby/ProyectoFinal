import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GGranjasRoutingModule } from './g-granjas-routing.module';
import { GGranjasComponent } from './g-granjas.component';
import { DetgranjasComponent } from './detgranjas/detgranjas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GGranjasComponent, 
    DetgranjasComponent
  ],
  imports: [
    CommonModule,
    GGranjasRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GGranjasModule { }
