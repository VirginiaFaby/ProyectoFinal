import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GRolesRoutingModule } from './g-roles-routing.module';
import { GRolesComponent } from './g-roles.component';
import { DetrolesComponent } from './detroles/detroles.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GRolesComponent, 
    DetrolesComponent
  ],
  imports: [
    CommonModule,
    GRolesRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports:[
    DetrolesComponent,
  ]
})
export class GRolesModule { }
