import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GTiposerviciosRoutingModule } from './g-tiposervicios-routing.module';
import { GTiposerviciosComponent } from './g-tiposervicios.component';
import { DettiposerviciosComponent } from './dettiposervicios/dettiposervicios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GTiposerviciosComponent, 
    DettiposerviciosComponent
  ],
  imports: [
    CommonModule,
    GTiposerviciosRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GTiposerviciosModule { }
