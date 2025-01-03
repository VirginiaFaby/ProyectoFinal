import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporcomRoutingModule } from './g-reporcom-routing.module';
import { GReporcomComponent } from './g-reporcom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporcomComponent
  ],
  imports: [
    CommonModule,
    GReporcomRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporcomModule { }
