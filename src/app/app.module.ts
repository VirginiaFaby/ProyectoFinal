import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceModule } from './service/service.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MenuesModule } from './components/menues/menues.module';
import { AccederModule } from './components/acceder/acceder.module';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceModule,
    HttpClientModule,
    MenuesModule,
    RouterModule,
    NgbModule,
    AccederModule,
    MenuesModule,
    
    
  ],
  providers: [
    DatePipe // Agrega DatePipe como proveedor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
