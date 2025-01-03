import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GComprasRoutingModule } from './g-compras-routing.module';
import { GComprasComponent } from './g-compras.component';
import { DetcomprasComponent } from './detcompras/detcompras.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    GComprasComponent, 
    DetcomprasComponent
  ],
  imports: [
    CommonModule,
    GComprasRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class GComprasModule { }
