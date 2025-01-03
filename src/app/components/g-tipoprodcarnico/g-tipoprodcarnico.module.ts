import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GTipoprodcarnicoRoutingModule } from './g-tipoprodcarnico-routing.module';
import { GTipoprodcarnicoComponent } from './g-tipoprodcarnico.component';
import { DettipoprodcarnicoComponent } from './dettipoprodcarnico/dettipoprodcarnico.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GTipoprodcarnicoComponent, 
    DettipoprodcarnicoComponent
  ],
  imports: [
    CommonModule,
    GTipoprodcarnicoRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GTipoprodcarnicoModule { }
