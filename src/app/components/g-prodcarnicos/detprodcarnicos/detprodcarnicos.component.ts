import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Camara } from 'src/app/model/camara.model';
import { ProdCarnicos } from 'src/app/model/prodcarnicos.model';
import { Serviciofaena } from 'src/app/model/serviciofaena.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Tipoprodcarnico } from 'src/app/model/tipoprodcarnico.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { CamaraService } from 'src/app/service/camara.service';
import { ProdcarnicosService } from 'src/app/service/prodcarnicos.service';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';
import { TipoprodcarnicoService } from 'src/app/service/tipoprodcarnico.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detprodcarnicos',
  templateUrl: './detprodcarnicos.component.html',
  styleUrls: ['./detprodcarnicos.component.css']
})
export class DetprodcarnicosComponent implements OnInit {


  form: FormGroup;
  pageActual: number = 1;
  submitted = false;
  prdcI: ProdCarnicos;

  tipoanimalI: Tipoanimal;
  index = 0;
  apiProdcarnicos: any;
  apiTipoanimal: any;

  tipoprodcarnicoI: Tipoprodcarnico;
  camaraI: Camara;
  serviciofaenaI: Serviciofaena;

  apiTipoprodcarnico: any;
  apiCamara: any;
  apiServiciofaena: any;
  apiDetprodc: any;


  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private prdcS: ProdcarnicosService,
    private aniS: AnimalesService,
    private camS: CamaraService,
    private tippS: TipoprodcarnicoService,
    private serfaS: ServiciofaenaService,
    private http: HttpClient,
  ) {
    this.prdcS.getProduCarnicosLista().subscribe(respon => {
      this.apiProdcarnicos = respon;
    });
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });

    this.camS.getCamaraLista().subscribe(respon => {
      this.apiCamara = respon;
    });
    this.tippS.getTipoprodcarnicoLista().subscribe(response => {
      this.apiTipoprodcarnico = response;
    });
    this.serfaS.getServiciofaenaLista().subscribe(response => {
      this.apiServiciofaena = response;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fechaing: ['', [Validators.required]],
      pesotot: [''],
      clientes: ['', [Validators.required]],
    });
  }
  get f() { return this.form.controls; }
  /*
    llamaModalMos(modal, prdc: ProdCarnicos) {
      this.prdcI = prdc;
  
      // Cargar detalles de compras específicos
      this.apiDetprodc = []; // Limpiar el array de detalles
      this.prdcS.getDetprodcByidprod(prdc.idprod).subscribe(response => {
        this.apiDetprodc = response;
        this.modalReference = this.modalService.open(modal, { size: 'lg' });
      });
    }
  */
  llamaModalMos(modal, prdc: ProdCarnicos) {
    this.prdcI = prdc;

    // Cargar los detalles de Detprodcar asociados con el producto cárnico
    this.apiDetprodc = []; // Limpiar el array de detalles
    this.prdcS.getDetprodcByidprod(prdc.idprod).subscribe(response => {
      this.apiDetprodc = response;

      // Asegurarse de que serviciofaena esté disponible
      if (this.apiDetprodc.length > 0 && this.apiDetprodc[0].serviciofaena) {
        console.log(this.apiDetprodc[0].serviciofaena.numfae);  // Verificar si numfae está disponible
      }

      // Abre el modal
      
      this.modalReference = this.modalService.open(modal, { size: 'lg', centered: true });
    });
  }



  //Modal de Eliminacion Logica 
  llamaModalDel(modal, prdc: ProdCarnicos) {
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.prdcI = prdc;
  }

  // Eliminación Lógica 
  onSubmitDel() {
    this.submitted = true;

    this.prdcS.eliminarProdcarnicosYActualizarCamara(this.prdcI.idprod).subscribe(
      response => {
        console.log("Eliminación lógica correcta", response);
        // Refrescar la lista
        this.prdcS.getProduCarnicosLista().subscribe(response => {
          this.apiProdcarnicos = response;
        });
        this.modalReference.close(); // Cerrar el modal solo después de que la eliminación sea exitosa
      },
      error => {
        console.error("Error al modificar", error);
        // Puedes agregar más lógica aquí si deseas mostrar un mensaje al usuario
      }
    );
  }




  listarProdc() {
    this.prdcS.getProduCarnicosLista().subscribe(respon => {
      this.apiProdcarnicos = respon;
    });
  }



  //Filtro 
  onChangeFiltroNombre(xnomprod: string, xestado: number) {
    this.prdcS.getProdcarnicosListaNombres(xnomprod, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiProdcarnicos = response;
    });
  }

  createPdf() {
    const imagePath1 = 'assets/matadero.png';  // Imagen del logo
    const imagePath2 = 'assets/descarga.jpg';  // Otra imagen si es necesario

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

                // Obtener datos de producto
                const fechaing = this.prdcI.fechaing || '';
                const numpro = this.prdcI.numpro || '';
                const nomcli = this.prdcI.clientes?.nomcli || '';
                const pesotot = this.prdcI.pesotot || 0;
                const numfae = this.apiDetprodc[0]?.serviciofaena?.numfae || '';

                // Datos del animal
                const raza = this.apiDetprodc[0]?.detserviciofaena.animales?.razas.nomraz || '';
                const pesoAnimal = this.apiDetprodc[0]?.detserviciofaena.animales?.pesani || 0;

                // Preparar datos para la tabla de detalles de productos cárnicos
                const detalleProductos = this.apiDetprodc.map((det, index) => {
                    return [
                        { text: (index + 1).toString(), alignment: 'center' },
                        { text: det.tipoprodcarnico.nompro },
                        { text: det.pesoing.toString(), alignment: 'center' }
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
                                        { text: `Nº ${numpro}`, style: 'text', alignment: 'right' },
                                        { text: '\n' },
                                        { text: 'DETALLE DE PRODUCTOS CÁRNICOS', style: 'title', alignment: 'center' },
                                        { text: '\n' },
                                        {
                                            columns: [
                                                { text: `CLIENTE: ${nomcli}`, style: 'text', alignment: 'left' },
                                                { text: `Nº FAENA ${numfae}`, style: 'text', alignment: 'right' }
                                            ],
                                            margin: [0, 5, 0, 5]
                                        },

                                        { text: `ANIMAL: ${raza} CON UN PESO DE ${pesoAnimal} Kg.`, style: 'text', alignment: 'left' },
                                        { text: '\n' },

                                        // Tabla de detalles de productos cárnicos
                                        {
                                            table: {
                                                headerRows: 1,
                                                widths: ['auto', '*', 'auto'],
                                                body: [
                                                    [
                                                        { text: 'Cant.', style: 'tableHeader', alignment: 'center' },
                                                        { text: 'Tipo Producto', style: 'tableHeader', alignment: 'center' },
                                                        { text: 'Peso (kg)', style: 'tableHeader', alignment: 'center' }
                                                    ],
                                                    ...detalleProductos
                                                ]
                                            },
                                            layout: 'lightHorizontalLines',
                                            margin: [0, 0, -18, 0]
                                        },

                                        // Tabla de total
                                        {
                                            table: {
                                                headerRows: 0,
                                                widths: ['*', 'auto'],
                                                body: [
                                                    [
                                                        { text: 'TOTAL', alignment: 'right', bold: true },
                                                        { text: pesotot.toString(), alignment: 'center' }
                                                    ]
                                                ]
                                            },
                                            layout: 'lightHorizontalLines',
                                            margin: [0, 2, 0, 0]
                                        },

                                        // Agregar la observación después de la tabla de total
                                        { text: 'Observación:', style: 'subTitle', alignment: 'center' },
                                        { text: this.prdcI.obserpro || '', style: 'text', alignment: 'center' }
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
