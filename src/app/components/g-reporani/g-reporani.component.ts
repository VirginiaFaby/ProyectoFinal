import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnimalesService } from 'src/app/service/animales.service';
import { CorralesService } from 'src/app/service/corrales.service';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { RazasService } from 'src/app/service/razas.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-g-reporani',
  templateUrl: './g-reporani.component.html',
  styleUrls: ['./g-reporani.component.css']
})
export class GReporaniComponent implements OnInit {

  formBusqueda: FormGroup;
  apiAnimales: any;

  apiGuiasenasag: any;
  apiTipoanimal: any;
  apiCorrales: any;
  apiRazas: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private aniS: AnimalesService,
    private guiaS: GuiasenasagService,
    private corS: CorralesService,
    private razS: RazasService,
    private http: HttpClient,
  ) {
    this.aniS.getAnimalesLista().subscribe(resp => {
      this.apiAnimales = resp;
    });
  }

  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      idGuiasenasag: [''],
      idTipoanimal: [''],
      idCorrales: [''],
      idRazas: [''],
      estado: ['-1', [Validators.required]],
      pesoMin: [''],
      pesoMax: [''],
    });
    this.cargarGuiasenasag();
    this.cargarTipoanimal();
    this.cargarCorrales();
    this.cargarRazas();

  }

  cargarGuiasenasag(): void {
    this.guiaS.getGuiasenasagLista().subscribe(resp => {
      this.apiGuiasenasag = resp;
    });
  }
  cargarTipoanimal(): void {
    this.aniS.getTipoAnimalesLista().subscribe(respo => {
      this.apiTipoanimal = respo;
    });
  }
  cargarCorrales(): void {
    this.corS.getCorralesLista().subscribe(resp => {
      this.apiCorrales = resp;
    });
  }
  cargarRazas(): void {
    this.razS.getRazasLista().subscribe(response => {
      this.apiRazas = response;
    });
  }

  buscarAnimales(): void {
    const { fechaInicio, fechaFin, idGuiasenasag, idTipoanimal, idCorrales, idRazas, estado, pesoMin, pesoMax } = this.formBusqueda.value;

    this.aniS.buscarAnimales(fechaInicio, fechaFin, idGuiasenasag, idTipoanimal, idCorrales, idRazas, estado, pesoMin, pesoMax)
      .subscribe(resp => {
        this.apiAnimales = resp;
        //this.calcularTotales(); // Recalcular totales después de la búsqueda
        console.log(resp);
      }, error => {
        console.error('Error al buscar Animales :', error);
      });
  }


  // Método para restablecer el formulario
  restablecerFormulario(): void {
    this.formBusqueda.reset({
      fechaInicio: '',
      fechaFin: '',
      idGuiasenasag: '',
      idTipoanimal: '',
      idCorrales: '',
      idRazas: '',
      estado: '-1', // Valor por defecto para el estado
      pesoMin: '',
      pesoMax: '',
    });
    this.aniS.getAnimalesLista().subscribe(resp => {
      this.apiAnimales = resp;
    });
    // Puedes agregar cualquier otra lógica que necesites al restablecer el formulario aquí
  }
  generarPDF() {
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
  
          // Inicializar las filas de la tabla con encabezados (sin la columna 'Estado')
          const tableBody = [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'Fecha Llegada', style: 'tableHeader', alignment: 'center' },
              { text: 'Raza', style: 'tableHeader', alignment: 'center' },
              { text: 'Guía', style: 'tableHeader', alignment: 'center' },
              { text: 'Corral', style: 'tableHeader', alignment: 'center' },
              { text: 'Tipo Animal', style: 'tableHeader', alignment: 'center' },
              { text: 'Peso', style: 'tableHeader', alignment: 'center' }
            ]
          ];
  
          // Agregar datos de apiAnimales a la tabla (sin la columna 'Estado')
          this.apiAnimales.forEach((ani, index) => {
            tableBody.push([
              { text: (index + 1).toString(), alignment: 'center', style: '' },
              { text: ani.feclleg || '', alignment: 'center', style: '' },
              { text: ani.razas.nomraz || '', alignment: 'center', style: '' },
              { text: ani.guiasenasag.nroguia || '', alignment: 'center', style: '' },
              { text: ani.corrales.nomcor || '', alignment: 'center', style: '' },
              { text: ani.tipoanimal.nomtip || '', alignment: 'center', style: '' },
              { text: ani.pesani ? ani.pesani.toString() : '', alignment: 'center', style: '' }
            ]);
          });
  
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString();
          const formattedTime = currentDate.toLocaleTimeString();
  
          const pdfDefinition = {
            content: [
              {
                columns: [
                  {
                    width: 8,
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
                      { canvas: [{ type: 'line', x1: 50, y1: 0, x2: 500, y2: 0, lineWidth: 2, lineColor: 'red' }] },
                      { text: '\n\n' },
                      { text: 'REPORTE DE ANIMALES', style: 'title', alignment: 'center' },
                      { text: '\n' },
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
                          body: tableBody
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 10, 0, 0]
                      }
                    ],
                    margin: [0, 0, 0, 10]
                  },
                  {
                    width: 20,
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
            footer: {
              columns: [
                { text: `Reporte generado el ${formattedDate} a las ${formattedTime}`, alignment: 'right', fontSize: 8 }
              ],
              margin: [0, -5, 5, 10]
            },
            styles: {
              title: { fontSize: 14, bold: true },
              subTitle: { fontSize: 12, bold: true },
              tableHeader: { bold: true, fillColor: '#eeeeee' }
            }
          };
  
          const pdf = pdfMake.createPdf(pdfDefinition);
          pdf.open();
        };
        reader2.readAsDataURL(blob2);
      };
      reader1.readAsDataURL(blob1);
    });
  }
  


  exportToExcel(): void {
    // Formatea los datos a exportar
    const formattedData = this.apiAnimales.map((ani: any, index: number) => ({
      '#': index + 1,
      'FECHA LLEGADA': ani.feclleg,
      'RAZA': ani.razas.nomraz,
      'GUIA': ani.guiasenasag.nroguia,
      'CORRAL': ani.corrales.nomcor,
      'TIPO ANIMAL': ani.tipoanimal.nomtip,
      'PESO': ani.pesani,
    }));

    // Crea un libro de trabajo y una hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    // Agrega un título en la primera fila
    XLSX.utils.sheet_add_aoa(worksheet, [['Reporte de Animales']], { origin: 'A1' });

    // Agrega los datos formateados empezando en la fila 3
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3', skipHeader: false });

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Animales');

    // Exporta el archivo Excel
    const fileName = 'reporte_animales.xlsx';
    XLSX.writeFile(workbook, fileName);
  }




}
