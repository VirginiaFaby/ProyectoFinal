import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GMenusRoutingModule } from './g-menus-routing.module';
import { GMenusComponent } from './g-menus.component';
import { DetmenusComponent } from './detmenus/detmenus.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GMenusComponent, 
    DetmenusComponent],
    
  imports: [
    CommonModule,
    GMenusRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports:[
    DetmenusComponent,
  ]
})
export class GMenusModule { }
