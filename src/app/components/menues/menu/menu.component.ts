import { Component, OnInit } from '@angular/core';
import { MenusService } from './../../../service/menus.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Personas } from 'src/app/model/personas.model';
import { Rolme } from 'src/app/model/rolme.model';
import { Mepro } from 'src/app/model/mepro.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  title = 'MyProject';
  apiMepro: any;
  apiRoles: any;
  roles: Rolme[] = [];
  menus: Mepro[] = [];
  listamenus: any[] = [];;
  listaprocesos: any[] = [];
  listaMepro: any[] = [];

  apiRolme: any;
  idrol: number = 0;
  private localStorageService: any;

  constructor(
    private menuService: MenusService,
    private xrouter: Router,
    private activatedroute: ActivatedRoute
  ) {
    this.localStorageService = localStorage;
  }

  ngOnInit() {
    let xlogin: string;
    let xtoken: string;
    this.activatedroute.params.subscribe(params => {
      if (this.isAuthenticated()) {
        xlogin = this.getCurrentSesion().usuarios.login; //xper.usuario.login;
        xtoken = this.getCurrentSesion().token; //xper.token;
        this.autenticado = true;
        this.cargarRoles(xlogin, xtoken);
        this.rol = true

      } else {
        this.idrol = 0;
        this.cargarRoles('0', '0');
        this.apiRoles = [];
        console.log('cero roles.....');
        this.rol = false
      }
    });
    this.menuService.getRolmenLista().subscribe(response => {
      this.apiRolme = response;
      this.roles = this.apiRolme || [];
      for (const e of this.roles) {
        this.listamenus.push(e.menu)
      }
    })

    this.menuService.getMenproLista().subscribe(response => {
      this.apiMepro = response;
      this.menus = this.apiMepro || [];

      for (const e of this.menus) {
        this.listaprocesos.push(e.proceso)
        this.listaMepro.push(e.meproId)

      }
      this.combinarMenusConProcesos(this.listamenus, this.listaMepro, this.listaprocesos);
    })
  }
  rol: boolean = false;
  onRolesChange(e) {

    alert(e)
    this.idrol = e;


  }

  cargarRoles(xlogin: string, xtoken: string) {
    if (xlogin != '0') {
      console.log("CARGAR_ROLES..." + xlogin);
      this.menuService.getRolesLista(xlogin, xtoken).subscribe(
        response => { // start of (1)
          this.apiRoles = response;
        }, // end of (1)
        (error: any) => console.log(error), // (2) second argument
        () => console.log('all data gets') // (3) second argument 
      );
    }
  }
  autenticado: boolean = false

  siEstaConectado() {
    if (this.isAuthenticated()) {

      this.localStorageService.removeItem('currentUser');
      this.xrouter.navigate([{ outlets: { pie: ['menuFooter', 'Invitado'] } }]);
    } else {
      this.autenticado = false;
    }
  }

  getCurrentSesion(): Personas {
    var xper = this.localStorageService.getItem('currentUser');
    return (xper) ? <Personas>JSON.parse(xper) : xper;
  }

  isAuthenticated(): boolean {
    return (this.getCurrentSesion() != null) ? true : false;
  };

  cambiopro(link: string) {
    this.xrouter.navigate(['/' + link]);

  }


  menuConProcesos: any[] = [];
  combinarMenusConProcesos(lmenu, lmepro, lproceso) {


    this.menuConProcesos = lmenu.map(menu => {
      // Encontramos los procesos asociados al menú actual
      const procesosAsociados = lmepro
        .filter(me => me.idmen === menu.idmen)  // Filtramos por el id del menú
        .map(me => lproceso.find(proceso => proceso.idpro === me.idpro));  // Buscamos el proceso correspondiente

      return {
        ...menu,
        procesos: procesosAsociados // Agregamos la lista de procesos al menú
      };
    });
    console.log(this.menuConProcesos)

  }

  menuSeleccionado: any = null;

  seleccionarMenu(menu: any) {
    this.menuSeleccionado = this.menuSeleccionado === menu ? null : menu; // Alternar selección
  }
}

