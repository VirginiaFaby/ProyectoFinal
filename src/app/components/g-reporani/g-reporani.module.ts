import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporaniRoutingModule } from './g-reporani-routing.module';
import { GReporaniComponent } from './g-reporani.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporaniComponent
  ],
  imports: [
    CommonModule,
    GReporaniRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporaniModule { }
