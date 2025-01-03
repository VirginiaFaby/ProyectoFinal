import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GProcesosRoutingModule } from './g-procesos-routing.module';
import { GProcesosComponent } from './g-procesos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DetprocesosComponent } from './detprocesos/detprocesos.component';


@NgModule({
  declarations: [
    GProcesosComponent,
    DetprocesosComponent,
  ],

  imports: [
    CommonModule,
    GProcesosRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  
  exports: [
    DetprocesosComponent,
  ]
})
export class GProcesosModule { }
