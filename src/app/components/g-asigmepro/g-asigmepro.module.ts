import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GAsigmeproRoutingModule } from './g-asigmepro-routing.module';
import { GAsigmeproComponent } from './g-asigmepro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GAsigmeproComponent
  ],
  imports: [
    CommonModule,
    GAsigmeproRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class GAsigmeproModule { }
