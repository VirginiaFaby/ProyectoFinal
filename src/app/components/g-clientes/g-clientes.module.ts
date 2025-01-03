import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GClientesRoutingModule } from './g-clientes-routing.module';
import { GClientesComponent } from './g-clientes.component';
import { DetclientesComponent } from './detclientes/detclientes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    GClientesComponent, 
    DetclientesComponent,
    GClientesComponent,
  ],
  imports: [
    CommonModule,
    GClientesRoutingModule, 
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    NgbModule
  ]
})
export class GClientesModule { }
