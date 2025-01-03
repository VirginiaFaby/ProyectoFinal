import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GAsigrolusuRoutingModule } from './g-asigrolusu-routing.module';
import { GAsigrolusuComponent } from './g-asigrolusu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [GAsigrolusuComponent],
  imports: [
    CommonModule,
    GAsigrolusuRoutingModule,   
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule

  ]
})
export class GAsigrolusuModule { }
