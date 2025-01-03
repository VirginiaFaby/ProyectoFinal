import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GReporserfaaniRoutingModule } from './g-reporserfaani-routing.module';
import { GReporserfaaniComponent } from './g-reporserfaani.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GReporserfaaniComponent
  ],
  imports: [
    CommonModule,
    GReporserfaaniRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class GReporserfaaniModule { }
