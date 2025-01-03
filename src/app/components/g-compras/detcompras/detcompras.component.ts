import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { Compras, Detcompras, Detcomtemp } from 'src/app/model/compras.model';
import { ComprasService } from 'src/app/service/compras.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-detcompras',
  templateUrl: './detcompras.component.html',
  styleUrls: ['./detcompras.component.css']
})
export class DetcomprasComponent implements OnInit {

  comI: Compras;
  detcomI: Detcomtemp;
  apiCompras: any;
  apiDetcompras: any;
  apiDetcomtemp: any;
  pageActual: number = 1;

  form: FormGroup;
  submitted = false;

  modalReference: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comS: ComprasService,
    private http: HttpClient,
  ) {
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
    });
    this.comS.getdetcompLista().subscribe(respo => {
      this.apiDetcompras = respo;
    });

  }
  actualizarlistadetcompras() {
    this.comS.getdetcompLista().subscribe(respo => {
      this.apiDetcompras = respo;
    });
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feccom: ['', [Validators.required]],
      impcom: [''],
      granjas: ['', [Validators.required]],

    });

  }

  listarCompras() {
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
    });
  }

  //filtro
  onChangeFiltroNombre(idgranja?: number, estado?: number) {
    this.comS.buscarCompras(idgranja, estado).subscribe(response => {
      console.log(estado + "aqui");
      this.apiCompras = response;
    });
  }

  llamaModalMos(modal, com: Compras) {
    this.comI = com;
    // Cargar detalles de compras específicos
    this.apiDetcompras = []; // Limpiar el array de detalles
    this.comS.getDetcomprasByidcom(com.idcom).subscribe(response => {
      this.apiDetcompras = response;
      this.modalReference = this.modalService.open(modal, { size: 'lg', centered: true });
    });
  }

  ///eliminacion de compras y destalle de compras, actualizacion  
  llamaModalDel(modal, com: Compras) {
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.comI = com;
  }

  onSubmitDel() {
    this.submitted = true;
    this.comS.eliminarCompraConDetalles(this.comI.idcom).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.listarCompras();
        this.actualizarlistadetcompras();
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
  
          // Datos principales
          const feccom = this.comI.feccom ? new Date(this.comI.feccom).toLocaleDateString() : 'N/A';
          const numcom = this.comI.numcom || 'N/A';
          const nomgra = this.comI.granjas?.nomgra || 'N/A';
          const codigo = this.comI.granjas?.codigo || 'N/A';
          const impcom = this.comI.impcom ? Number(this.comI.impcom) : 0;
  
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
  
          const montoEnLetras = `SON: ${numberToWords(impcom)}`;
  
          // Detalles de compras
          const detalleCompras = this.apiDetcompras.map((dcom, index) => {
            const raza = dcom.animales?.razas?.nomraz || 'Sin raza';
            const peso = dcom.animales?.pesani || 0;
            const precioCompra = dcom.precom || 0;
            const subtotal = (dcom.precom * dcom.cancom).toFixed(2);
  
            return [
              { text: (index + 1).toString(), alignment: 'center' },
              { text: `Raza ${raza}, peso ${peso} kg`, alignment: 'left' },
              { text: precioCompra.toFixed(2), alignment: 'center' },
              { text: subtotal, alignment: 'center' }
            ];
          });
  
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
                      { text: '\nENTIDAD DESCENTRALIZADA\n', style: 'title', alignment: 'center' },
                      { text: '“MATADERO FRIGORÍFICO MUNICIPAL DE TARIJA”\n\n', style: 'subTitle', alignment: 'center' },
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 455, y2: 0, lineWidth: 2, lineColor: 'red' }] },
                      { text: '\n' },
                      { text: `Nº RECIBO: ${numcom}`, style: 'text', alignment: 'right' },
                      { text: 'DETALLE DE COMPRAS', style: 'header', alignment: 'center' },
                      { text: `\nFECHA: ${feccom}`, style: 'text', alignment: 'left' },
                      {
                        columns: [
                          { text: `GRANJA: ${nomgra}`, style: 'text', alignment: 'left' },
                          { text: `CÓDIGO: ${codigo}`, style: 'text', alignment: 'right' },
                        ],
                        margin: [0, 5, 0, 5]
                      },
  
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', '*', 'auto', 'auto'],
                          body: [
                            [
                              { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
                              { text: 'DESCRIPCIÓN', style: 'tableHeader', alignment: 'center' },
                              { text: 'P. UNIT.', style: 'tableHeader', alignment: 'center' },
                              { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'center' }
                            ],
                            ...detalleCompras
                          ]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 0, 0, 10]
                      },
                      {
                        table: {
                          headerRows: 0,
                          widths: ['*', 'auto'],
                          body: [
                            [
                              { text: 'TOTAL', alignment: 'right', bold: true },
                              { text: impcom.toFixed(2), alignment: 'center' }
                            ]
                          ]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, -10, 10, 0]
                      },
  
                      // Monto en letras
                      { text: `\n${montoEnLetras}`, style: 'text' }
                    ]
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
          pdfMake.createPdf(pdfDefinition).open();
        };
  
        reader2.readAsDataURL(blob2);
      };
  
      reader1.readAsDataURL(blob1);
    });
  }
  




}
