import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GAsigrolmeRoutingModule } from './g-asigrolme-routing.module';
import { GAsigrolmeComponent } from './g-asigrolme.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GAsigrolmeComponent
  ],
  imports: 
  [
    CommonModule,
    GAsigrolmeRoutingModule,
    NgxPaginationModule,
    FormsModule,
  ]
  
})
export class GAsigrolmeModule { }
