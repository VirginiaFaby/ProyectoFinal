import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GCamaraRoutingModule } from './g-camara-routing.module';
import { GCamaraComponent } from './g-camara.component';
import { DetcamaraComponent } from './detcamara/detcamara.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GCamaraComponent, 
    DetcamaraComponent, 
  ],
  imports: [
    CommonModule,
    GCamaraRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GCamaraModule { }
