import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GEntregaprodcRoutingModule } from './g-entregaprodc-routing.module';
import { GEntregaprodcComponent } from './g-entregaprodc.component';
import { DetentregaprodcComponent } from './detentregaprodc/detentregaprodc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GEntregaprodcComponent, 
    DetentregaprodcComponent
  ],
  imports: [
    CommonModule,
    GEntregaprodcRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GEntregaprodcModule { }
