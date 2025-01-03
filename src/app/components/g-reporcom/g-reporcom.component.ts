import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComprasService } from 'src/app/service/compras.service';
import { GranjasService } from 'src/app/service/granjas.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-g-reporcom',
  templateUrl: './g-reporcom.component.html',
  styleUrls: ['./g-reporcom.component.css']
})
export class GReporcomComponent implements OnInit {

  formBusqueda: FormGroup;
  apiCompras: any;
  apiGranjas: any;

  totalcom: number = 0;
  totalcanani: number = 0;
  totalcomven: number =0 ;
  totalparven : number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private comS: ComprasService,
    private granS: GranjasService,
  ) { 
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
      this.calcularTotales();
    });
  }

  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      numcom: [''],
      idGranjas:[''],
      estado: ['-1', [Validators.required]]
    });
    this.cargarGranjas();
  }


  cargarGranjas(): void {
    this.granS.getGranjasLista().subscribe(respo => {
      this.apiGranjas = respo;
    });
  }

  calcularTotales() {
    this.totalcom = 0;
    this.totalcanani = 0;
    this.totalcomven =0 ;
    this.totalparven = 0;

    if (this.apiCompras && this.apiCompras.length > 0) {
      this.totalcom = this.apiCompras.reduce((acc, com) => acc + (com.impcom || 0), 0);
      this.totalcanani = this.apiCompras.reduce((acc, com) => acc + (com.cancani || 0), 0);
      this.totalcomven = this.apiCompras.reduce((acc, com) => acc + (com.comven || 0), 0);
      this.totalparven = this.apiCompras.reduce((acc, com) => acc + (com.parven || 0), 0);
    }
  }

  buscareporcom() {
    let { fechaInicio, fechaFin, numcom, idGranjas, estado } = this.formBusqueda.value;

    if (fechaInicio && fechaInicio instanceof Date) {
      fechaInicio = fechaInicio.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    if (fechaFin && fechaFin instanceof Date) {
      fechaFin = fechaFin.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    this.comS.buscareporcom(fechaInicio, fechaFin, numcom, idGranjas, estado).subscribe(
      response => {
        this.apiCompras = response;
        this.calcularTotales(); // Recalcular los totales después de obtener los datos
      },
      error => {
        console.error('Error al buscar servicios de faena:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }
  restablecerFormulario(): void {
    this.formBusqueda.reset({
      fechaInicio: '',
      fechaFin: '',
      numcom: '',
      idGranjas:'',
      estado: '-1' // Valor por defecto para el estado
    });
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
      this.calcularTotales();
    });
  }

  generateCompraPDF() {
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
  
          // Inicializamos los totales
          let totalAnimales = this.totalcanani || 0;
          let totalComprados = this.totalcomven || 0;
          let totalVendidos = this.totalparven || 0;
          let totalImporte = this.totalcom || 0;
  
          // Filas para la tabla, utilizando datos de apiCompras
          const tableBody = [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'FECHA', style: 'tableHeader', alignment: 'center' },
              { text: 'Nº RECIBO', style: 'tableHeader', alignment: 'center' },
              { text: 'GRANGA', style: 'tableHeader', alignment: 'center' },
              { text: 'COMPRADOS', style: 'tableHeader', alignment: 'center' },
              { text: 'VENDIDOS', style: 'tableHeader', alignment: 'center' },
              { text: 'RESTANTE', style: 'tableHeader', alignment: 'center' },
              { text: 'IMPORTE', style: 'tableHeader', alignment: 'center' }
            ]
          ];
  
          // Agregar filas con datos de apiCompras
          this.apiCompras.forEach((com, index) => {
            tableBody.push([
              { text: (index + 1).toString(), alignment: 'center', style: '' },
              { text: com.feccom || '', alignment: 'center', style: '' },
              { text: com.numcom || '', alignment: 'center', style: '' },
              { text: com.granjas?.nomgra || '', alignment: 'center', style: '' },
              { text: com.cancani.toString(), alignment: 'center', style: '' },
              { text: com.comven.toString(), alignment: 'center', style: '' },
              { text: com.parven.toString(), alignment: 'center', style: '' },
              { text: com.impcom.toString(), alignment: 'center', style: '' }
            ]);
          });
  
          // Agregar fila de totales
          tableBody.push([
            { text: '', alignment: 'center', style: ''  },
            { text: '', alignment: 'center', style: '' },
            { text: '', alignment: 'center', style: '' },
            { text: 'TOTAL', alignment: 'center', style: 'boldText' },
            { text: totalAnimales.toString(), alignment: 'center', style: '' },
            { text: totalComprados.toString(), alignment: 'center', style: '' },
            { text: totalVendidos.toString(), alignment: 'center', style: '' },
            { text: totalImporte.toString(), alignment: 'center', style: '' }
          ]);
  
          // Obtener la fecha y hora actuales
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
                      { text: 'REPORTE DE COMPRAS', style: 'title', alignment: 'center' },
                      { text: '\n' },
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
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
              text: { fontSize: 10 },
              tableHeader: { bold: true, fillColor: '#eeeeee' },
              boldText: { bold: true }
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

  exportToExcelCompras(): void {
    // Formatea los datos a exportar
    const formattedData = this.apiCompras.map((com: any, index: number) => ({
      '#': index + 1,
      'FECHA': com.feccom,
      'Nº RECIBO': com.numcom,
      'GRANJA': com.granjas.nomgra,
      'COMPRADOS': com.cancani,
      'VENDIDOS': com.comven,
      'RESTANTE': com.parven,
      'IMPORTE': com.impcom,

    }));
  
    // Crea un libro de trabajo y una hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Agrega un título en la primera fila
    XLSX.utils.sheet_add_aoa(worksheet, [['Reporte de Compras']], { origin: 'A1' });
  
    // Agrega los datos formateados empezando en la fila 3
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3', skipHeader: false });
  
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');
  
    // Exporta el archivo Excel
    const fileName = 'reporte_compras.xlsx';
    XLSX.writeFile(workbook, fileName);
  }
  
  

  

}
