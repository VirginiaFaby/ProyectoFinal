import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporserfaeRoutingModule } from './g-reporserfae-routing.module';
import { GReporserfaeComponent } from './g-reporserfae.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporserfaeComponent
  ],
  imports: [
    CommonModule,
    GReporserfaeRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporserfaeModule { }
