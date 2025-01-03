import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporguiaRoutingModule } from './g-reporguia-routing.module';
import { GReporguiaComponent } from './g-reporguia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporguiaComponent
  ],
  imports: [
    CommonModule,
    GReporguiaRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporguiaModule { }
