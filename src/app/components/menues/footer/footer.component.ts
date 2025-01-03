import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Personas } from 'src/app/model/personas.model';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
 
  usuarioConec = '';
  usuarioRol= '';
  hoy = new Date();
  Num:number = 35;
  private localStorageService : any;

  constructor(
    private xrouter: ActivatedRoute,
    private router: Router
  ) {
    this.localStorageService = localStorage;
   }

  ngOnInit(): void {
    this.xrouter.params.subscribe( params => {
      if (this.isAuthenticated()) {        
        if (this.getCurrentSesion().ap == null)       // Validar los apellidos nulos
          this.usuarioConec = this.getCurrentSesion().nombre+" "+this.getCurrentSesion().am;
        else if (this.getCurrentSesion().am == null)
          this.usuarioConec = this.getCurrentSesion().nombre+" "+this.getCurrentSesion().ap;
        else 
          this.usuarioConec = this.getCurrentSesion().nombre+" "+this.getCurrentSesion().ap+" "+this.getCurrentSesion().am;
        
      }else {
        this.usuarioConec = 'Invitado';
      }
    });
  }

  getCurrentSesion(): Personas {
    var xper = this.localStorageService.getItem('currentUser');
    return (xper) ? <Personas> JSON.parse(xper) : xper;
  }
  
  isAuthenticated(): boolean {
    return (this.getCurrentSesion() != null) ? true : false;
  };

}

