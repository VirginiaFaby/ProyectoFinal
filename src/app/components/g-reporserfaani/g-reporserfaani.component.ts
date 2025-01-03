import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ClientesService } from 'src/app/service/clientes.service';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';

@Component({
  selector: 'app-g-reporserfaani',
  templateUrl: './g-reporserfaani.component.html',
  styleUrls: ['./g-reporserfaani.component.css']
})
export class GReporserfaaniComponent implements OnInit {

  razaMayor: string = '';
  totalMayor: number = 0;
  razaMenor: string = '';
  totalMenor: number = 0;
  mensaje: string = '';

  apiDetserfa: any
  
  constructor(
    private formBuilder : FormBuilder,
    private serfaS : ServiciofaenaService,
    private cliS: ClientesService,
    private http: HttpClient,
  ) {

    this.serfaS.getDetserfaLista().subscribe(response =>{
      this.apiDetserfa = response;
    });
    
   }

  ngOnInit(): void {
    this.obtenerEstadisticas();
  }

  obtenerEstadisticas(): void {
    this.serfaS.getEstadisticasRazas().subscribe({
      next: (data) => {
        if (data.mensaje) {
          this.mensaje = data.mensaje;
        } else {
          this.razaMayor = data.razaMayor;
          this.totalMayor = data.totalMayor;
          this.razaMenor = data.razaMenor;
          this.totalMenor = data.totalMenor;
        }
      },
      error: (err) => {
        console.error('Error al obtener las estadísticas de razas:', err);
      }
    });
  }

}
