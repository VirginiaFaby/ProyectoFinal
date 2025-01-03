import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Detventas, Detventastemp, Ventas } from 'src/app/model/ventas.model';
import { VentasService } from 'src/app/service/ventas.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detventas',
  templateUrl: './detventas.component.html',
  styleUrls: ['./detventas.component.css']
})
export class DetventasComponent implements OnInit {


  //ventas
  venI: Ventas;
  detvenI:  Detventas;
  apiVentas: any;
  apiDetventas: any;
  apiDetventemp: any;
  pageActual: number = 1;

  form: FormGroup;
  submitted = false;

  modalReference: NgbModalRef;

  constructor(
    private venS: VentasService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {
    this.venS.getVentasLista().subscribe(response => {
      this.apiVentas = response;
     // console.log(this.apiVentas);
    });
    this.venS.getDetventasLista().subscribe(respo => {
      this.apiDetventas = respo;
      //console.log(this.apiDetventas);
    });

  }

  actualizarlistadetventas() {
    this.venS.getDetventasLista().subscribe(respo => {
      this.apiDetventas = respo;
      //console.log(this.apiDetventas);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecven: ['', [Validators.required]],
      impven: [''],
      clientes: ['', [Validators.required]],

    });
  }

  listarVentas(){
    this.venS.getVentasLista().subscribe( respon=>{
      this.apiVentas = respon;
    });
  }

  onChangeFiltroNombre(idcli?: number, estado?: number) {
    this.venS.buscarVentas(idcli, estado).subscribe(response => {
      console.log(estado + "aqui");
      this.apiVentas = response;
    });
  }

  
  llamaModalMos(modal, ven : Ventas) {
    this.venI = ven;
    // Cargar detalles de compras específicos
    this.apiDetventas = []; // Limpiar el array de detalles
    this.venS.getDetvenByidven(ven.idven).subscribe(response => {
      this.apiDetventas = response;
      this.modalReference = this.modalService.open(modal, { size: 'lg', centered: true });
    });
  }

    ///eliminacion de compras y destalle de compras, actualizacion  
    llamaModalDel(modal, ven: Ventas) {
      this.modalReference = this.modalService.open(modal, { centered: true });
      this.venI = ven;
    }
  
    onSubmitDel() {
      this.submitted = true;
      this.venS.eliminarVentas(this.venI.idven).subscribe(
        response => {
          console.log("Eliminacion logica correcta");
          // REFERESCA LA LISTA
          this.listarVentas();
          this.actualizarlistadetventas();
        },
        error => {
          console.log("Eror al modificar");
        }
      );
      this.modalReference.close();  //para cerrar
    }

    createPdf() {
      const imagePath1 = 'assets/matadero.png';
      const imagePath2 = 'assets/descarga.jpg';
  
      forkJoin([
          this.http.get(imagePath1, { responseType: 'blob' }),
          this.http.get(imagePath2, { responseType: 'blob' })
      ]).subscribe(([blob1, blob2]) => {
          const reader1 = new FileReader();
          reader1.onloadend = () => {
              const imageDataURL1 = reader1.result as string;
  
              const reader2 = new FileReader();
              reader2.onloadend = () => {
                  const imageDataURL2 = reader2.result as string;
  
                  // Obtener datos de venta
                  const fecven = this.venI.fecven || '';
                  const numven = this.venI.numven || '';
                  const nomcli = this.venI.clientes?.nomcli || '';
                  const impven = this.venI.impven || '';
                  
                  // Datos adicionales del usuario
                  const usuarioNombre = `${this.venI.personas?.nombre || ''} ${this.venI.personas?.ap || ''} ${this.venI.personas?.am || ''}`;
  
                  // Preparar datos para la tabla de detalles de ventas
                  const detalleVentas = this.apiDetventas.map((dven, index) => {
                      return [
                          { text: (index + 1).toString(), alignment: 'center' },
                          { text: dven.detcompras.animales?.razas?.nomraz || 'N/A', alignment: 'center' },
                          { text: dven.canven !== undefined ? dven.canven.toString() : 'N/A', alignment: 'center' },
                          { text: dven.preven !== undefined ? dven.preven.toString() : 'N/A', alignment: 'center' }
                      ];
                  });
  
                  // Definición del PDF
                  const pdfDefinition = {
                      content: [
                          {
                              columns: [
                                  {
                                      width: 55,
                                      image: imageDataURL2,
                                      fit: [55, 55],
                                      alignment: 'left',
                                      margin: [10, 15, 0, 0]
                                  },
                                  {
                                      width: '*',
                                      stack: [
                                          { text: '\n\nENTIDAD DESCENTRALIZADA\n', style: 'title', alignment: 'center' },
                                          { text: '“MATADERO FRIGORÍFICO MUNICIPAL DE TARIJA”\n\n', style: 'subTitle', alignment: 'center' },
                                          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 455, y2: 0, lineWidth: 2, lineColor: 'red' }] },
                                          { text: '\n' },
  
                                          // Detalles de venta
                                          { text: `Nº ${numven}`, style: 'text', alignment: 'right' },
                                          { text: '\n' },
                                          { text: 'DETALLE DE VENTAS', style: 'title', alignment: 'center' },
                                          { text: '\n' },
                                          { text: `FECHA: ${fecven}`, style: 'text', alignment: 'left' },
                                          { text: `CLIENTE: ${nomcli}`, style: 'text', alignment: 'left' },
                                          { text: `USUARIO: ${usuarioNombre}`, style: 'text', alignment: 'left' },
                                          { text: '\n' },
  
                                          // Tabla de detalles de ventas
                                          {
                                              table: {
                                                  headerRows: 1,
                                                  widths: ['auto', '*', 'auto', 'auto'],
                                                  body: [
                                                      [
                                                          { text: 'Cant.', style: 'tableHeader', alignment: 'center' },
                                                          { text: 'Animales', style: 'tableHeader', alignment: 'center' },
                                                          { text: 'Cantidad', style: 'tableHeader', alignment: 'center' },
                                                          { text: 'Precio Venta', style: 'tableHeader', alignment: 'center' }
                                                      ],
                                                      ...detalleVentas
                                                  ]
                                              },
                                              layout: 'lightHorizontalLines',
                                              margin: [0, 0, -20, 0]
                                          },
  
                                          // Tabla de total de la venta
                                          {
                                              table: {
                                                  headerRows: 0,
                                                  widths: ['*', 'auto'],
                                                  body: [
                                                      [
                                                          { text: 'TOTAL ', alignment: 'right' },
                                                          { text: impven.toString(), alignment: 'center' }
                                                      ]
                                                  ]
                                              },
                                              layout: 'lightHorizontalLines',
                                              margin: [0, 5, 0, 0]
                                          }
                                      ],
                                      margin: [0, 0, 0, 10]
                                  },
                                  {
                                      width: 55,
                                      image: imageDataURL1,
                                      fit: [55, 55],
                                      alignment: 'right',
                                      margin: [0, 15, 10, 0]
                                  }
                              ],
                              margin: [0, 0, 0, 10]
                          }
                      ],
                      pageSize: 'A4',
                      pageMargins: [10, 10, 10, 10],
                      styles: {
                          header: { fontSize: 14, bold: true },
                          text: { fontSize: 10 },
                          tableHeader: { bold: true, fillColor: '#eeeeee' },
                          title: { fontSize: 14, bold: true },
                          subTitle: { fontSize: 12, bold: true, italics: true },
                          entityHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] }
                      }
                  };
  
                  // Crear y abrir el PDF
                  const pdf = pdfMake.createPdf(pdfDefinition);
                  pdf.open();
              };
              reader2.readAsDataURL(blob2);
          };
          reader1.readAsDataURL(blob1);
      });
  }
  

  

}
