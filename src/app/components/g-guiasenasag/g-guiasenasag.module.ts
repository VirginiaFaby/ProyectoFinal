import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GGuiasenasagRoutingModule } from './g-guiasenasag-routing.module';
import { GGuiasenasagComponent } from './g-guiasenasag.component';
import { DetguiasenasagComponent } from './detguiasenasag/detguiasenasag.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GGuiasenasagComponent, 
    DetguiasenasagComponent
  ],
  imports: [
    CommonModule,
    GGuiasenasagRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GGuiasenasagModule { }
