import { Component } from '@angular/core';
import { LogeoService } from './service/logeo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyProject';
  constructor(private loginS:LogeoService ) { 
  }
 activo=false;
  ngOnInit() {
	}
  conectado(){
    return this.loginS.conectado()
  }

}