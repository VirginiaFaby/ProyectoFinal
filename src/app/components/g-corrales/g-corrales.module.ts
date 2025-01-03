import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GCorralesRoutingModule } from './g-corrales-routing.module';
import { GCorralesComponent } from './g-corrales.component';
import { DetcorralesComponent } from './detcorrales/detcorrales.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GCorralesComponent, 
    DetcorralesComponent
  ],
  imports: [
    CommonModule,
    GCorralesRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GCorralesModule { }
