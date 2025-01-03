import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporvenRoutingModule } from './g-reporven-routing.module';
import { GReporvenComponent } from './g-reporven.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporvenComponent
  ],
  imports: [
    CommonModule,
    GReporvenRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporvenModule { }
