import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Serviciofaena } from 'src/app/model/serviciofaena.model';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detserviciofaena',
  templateUrl: './detserviciofaena.component.html',
  styleUrls: ['./detserviciofaena.component.css']
})
export class DetserviciofaenaComponent implements OnInit {


  apiSerfaena: any;
  index = 0;
  submitted = false;
  form : FormGroup;
  serfaenaI : Serviciofaena;
  apiDetserfa: any;

  

  pageActual: number = 1 ;
  modalReference: NgbModalRef;  //para mensaje
  
  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private serfaS : ServiciofaenaService,
    private http: HttpClient,
  ) {
    this.serfaS.getServiciofaenaLista().subscribe(response =>{
      this.apiSerfaena = response;
    });
    this.serfaS.getDetserfaLista().subscribe(response =>{
      this.apiDetserfa = response;
    });

   }

   listarSerfaena (){
    this.serfaS.getServiciofaenaLista().subscribe(response =>{
      this.apiSerfaena = response;
    });
   }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecser : ['', [Validators.required]],
      impser : ['', [Validators.required]],
    })
  }


    //filtro

    onChangeFiltroNombre(idcli?: number, estado?: number) {
      this.serfaS.buscarSerfa(idcli, estado).subscribe(response => {
        console.log(estado + "aqui");
        this.apiSerfaena = response;
      });
    }
    


    llamaModalMos(modal, serfae: Serviciofaena) {
      this.serfaenaI = serfae;
  
      // Cargar detalles de compras específicos
      this.apiDetserfa = []; // Limpiar el array de detalles
      this.serfaS.getDetserfaeByIdserfae(serfae.idserfae).subscribe(response => {
        this.apiDetserfa = response;
        this.modalReference = this.modalService.open(modal, { 
          size: 'lg', 
          centered: true // Esto asegura que el modal se centre en la pantalla
        });
      });
    }
///eliminacion de servicios de faena 
    llamaModalDel( modal, serfae : Serviciofaena){
      this.modalReference = this.modalService.open(modal, { centered: true }); 
      this.serfaenaI = serfae;
      
    }
  
    onSubmitDel() {
      this.submitted = true; 
      this.serfaS. eliminarServicioFaena(this.serfaenaI.idserfae).subscribe(  
        response => {
            console.log("Eliminacion logica correcta"); 
            // REFERESCA LA LISTA
            this.listarSerfaena();
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
      
              // Función para convertir números a palabras en español
              const numberToWords = (num: number): string => {
                const UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
                const TENS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
                const TEENS = [
                  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 
                  'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
                ];
                const HUNDREDS = [
                  '', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 
                  'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
                ];
      
                const getDecimalPart = (num: number): number => Math.round((num - Math.floor(num)) * 100);
      
                const toWords = (n: number): string => {
                  if (n < 10) return UNITS[n];
                  if (n < 20) return TEENS[n - 10];
                  if (n < 100) {
                    const tens = TENS[Math.floor(n / 10)];
                    const units = n % 10 === 0 ? '' : UNITS[n % 10]; // No añadir "cero"
                    return `${tens} ${units}`.trim();
                  }
                  if (n < 1000) {
                    const hundreds = HUNDREDS[Math.floor(n / 100)];
                    const remainder = n % 100 === 0 ? '' : toWords(n % 100); // No añadir "cero"
                    return `${hundreds} ${remainder}`.trim();
                  }
                  return 'Número demasiado grande';
                };
      
                const integerPart = Math.floor(num);
                const decimalPart = getDecimalPart(num);
      
                // Convertir sólo la parte entera en palabras
                const integerWords = toWords(integerPart);
      
                // Si hay decimales (centavos), añadirlos al formato XX/100
                if (decimalPart > 0) {
                  return `${integerWords} ${decimalPart}/100 bolivianos`.toUpperCase();
                } else {
                  return `${integerWords} 00/100 bolivianos`.toUpperCase();
                }
              };
      
              // Obtener datos dinámicos
              const fecser = this.serfaenaI.fecser ? new Date(this.serfaenaI.fecser).toLocaleDateString() : '';
              const numfae = this.serfaenaI.numfae || '';
              const nomcli = this.serfaenaI.clientes?.nomcli || '';
              const nit = this.serfaenaI.clientes?.nit || '';
              const impser = this.serfaenaI.impser ? Number(this.serfaenaI.impser) : 0;
              const montoEnLetras = `SON: ${numberToWords(impser)}`;
      
              // Detalles de servicios
              const detalleServicios = this.apiDetserfa.map(det => {
                return [
                  { text: det.canser.toString(), alignment: 'center' },
                  { text: `${det.tiposervicios.nomser} DE RAZA ${det.animales?.razas?.nomraz} CON UN PESO DE ${det.animales?.pesani} KG.`, alignment: 'left' },
                  { text: det.preser.toString(), alignment: 'center' },
                  { text: (det.preser * det.canser).toFixed(2), alignment: 'center' }
                ];
              });
      
              // Definir el PDF
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
                          { text: `Nº RECIBO: ${numfae}`, style: 'text', alignment: 'right' },
                          { text: 'SERVICIOS DE FAENA', style: 'title', alignment: 'center' },
                          { text: '\n' },
                          { text: `FECHA: ${fecser}`, style: 'text', alignment: 'left' },
                          {
                            columns: [
                              { text: `CLIENTE: ${nomcli}`, style: 'text', alignment: 'left' },
                              { text: `NIT: ${nit}`, style: 'text', alignment: 'right' }
                            ],
                            margin: [0, 5, 0, 5]
                          },
                          { text: '\n' },
      
                          // Tabla de detalles de servicios
                          {
                            table: {
                              headerRows: 1,
                              widths: ['auto', '*', 'auto', 'auto'],
                              body: [
                                [
                                  { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
                                  { text: 'DESCRIPCIÓN', style: 'tableHeader', alignment: 'center' },
                                  { text: 'P.UNIT.', style: 'tableHeader', alignment: 'center' },
                                  { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'center' }
                                ],
                                ...detalleServicios
                              ]
                            },
                            layout: 'lightHorizontalLines',
                            margin: [0, 0, 0, 10]
                          },
      
                          // Total del servicio
                          {
                            table: {
                              headerRows: 0,
                              widths: ['*', 'auto'],
                              body: [
                                [
                                  { text: 'TOTAL', alignment: 'right', bold: true },
                                  { text: impser.toFixed(2), alignment: 'center' }, // Total formateado
                                  
                                ]
                              ]
                            },
                            layout: 'lightHorizontalLines',
                            margin: [0, -20, 15, 0]
                          },
      
                          // Monto en letras
                          {
                            text: montoEnLetras,
                            style: 'text',
                            alignment: 'left',
                            margin: [0, 10, 0, 0],
                            bold: true
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
                  text: { fontSize: 12 },
                  tableHeader: { bold: true, fillColor: '#eeeeee' },
                  title: { fontSize: 14, bold: true },
                  subTitle: { fontSize: 12, bold: true, italics: true }
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
