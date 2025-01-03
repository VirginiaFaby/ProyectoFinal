import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GProdcarnicosRoutingModule } from './g-prodcarnicos-routing.module';
import { GProdcarnicosComponent } from './g-prodcarnicos.component';
import { DetprodcarnicosComponent } from './detprodcarnicos/detprodcarnicos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GProdcarnicosComponent, 
    DetprodcarnicosComponent
  ],
  imports: [
    CommonModule,
    GProdcarnicosRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GProdcarnicosModule { }
