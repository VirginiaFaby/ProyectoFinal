import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GServiciofaenaRoutingModule } from './g-serviciofaena-routing.module';
import { GServiciofaenaComponent } from './g-serviciofaena.component';
import { DetserviciofaenaComponent } from './detserviciofaena/detserviciofaena.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GServiciofaenaComponent, 
    DetserviciofaenaComponent
  ],
  imports: [
    CommonModule,
    GServiciofaenaRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GServiciofaenaModule { }
