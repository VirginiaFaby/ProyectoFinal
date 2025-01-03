import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GVentasRoutingModule } from './g-ventas-routing.module';
import { GVentasComponent } from './g-ventas.component';
import { DetventasComponent } from './detventas/detventas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GVentasComponent, 
    DetventasComponent
  ],
  imports: [
    CommonModule,
    GVentasRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GVentasModule { }
