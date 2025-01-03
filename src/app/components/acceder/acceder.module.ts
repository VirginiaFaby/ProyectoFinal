import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogeoComponent } from './logeo/logeo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DesconectarComponent } from './logeo/desconectar.component';


@NgModule({
  declarations: [
    LogeoComponent,
    DesconectarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    LogeoComponent,
  ]
})
export class AccederModule { }

