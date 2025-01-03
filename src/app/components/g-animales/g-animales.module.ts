import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GAnimalesRoutingModule } from './g-animales-routing.module';
import { GAnimalesComponent } from './g-animales.component';
import { DetanimalesComponent } from './detanimales/detanimales.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GAnimalesComponent,
    DetanimalesComponent
  ],
  imports: [
    CommonModule,
    GAnimalesRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    
  ]

})
export class GAnimalesModule { }
