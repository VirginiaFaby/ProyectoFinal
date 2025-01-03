import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ClientesService } from 'src/app/service/clientes.service';
import { VentasService } from 'src/app/service/ventas.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-g-reporven',
  templateUrl: './g-reporven.component.html',
  styleUrls: ['./g-reporven.component.css']
})
export class GReporvenComponent implements OnInit {

   //ventas
   apiVentas: any;
   formBusqueda: FormGroup;
   apiClientes: any;

   totalven: number = 0;
   totalcanani: number = 0;


   mayorReses: { raza: string; total: number } | null = null;
   menorReses: { raza: string; total: number } | null = null;
   mayorCerdos: { raza: string; total: number } | null = null;
   menorCerdos: { raza: string; total: number } | null = null;
   mensajeReses: string = '';
   mensajeCerdos: string = '';  



  constructor(
    private venS: VentasService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cliS: ClientesService,

  ) {
    this.venS.getVentasLista().subscribe(response => {
      this.apiVentas = response;
     console.log(this.apiVentas);
     this.calcularTotales();
    });

    
   }

  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      numven: [''],
      idCliente:[''],
      estado: ['-1', [Validators.required]]

    });
    this.cargarClientes();
    this.obtenerEstadisticas();
  }
  
  calcularTotales() {
    this.totalven= 0; // Reiniciar totales a cero
    this.totalcanani= 0;
    if (this.apiVentas && this.apiVentas.length > 0) {
      this.totalven = this.apiVentas.reduce((acc, ven) => acc + (ven.impven || 0), 0);
      this.totalcanani = this.apiVentas.reduce((acc, ven) => acc + (ven.canani || 0), 0);
    }
  }
  cargarClientes(): void {
    this.cliS.getClientesLista().subscribe(respo => {
      this.apiClientes = respo;
    });
  }

  buscareporven() {
    let { fechaInicio, fechaFin, numven, idCliente, estado } = this.formBusqueda.value;

    if (fechaInicio && fechaInicio instanceof Date) {
      fechaInicio = fechaInicio.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    if (fechaFin && fechaFin instanceof Date) {
      fechaFin = fechaFin.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    this.venS.buscareporven(fechaInicio, fechaFin, numven, idCliente, estado).subscribe(
      response => {
        this.apiVentas = response;
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
      numven: '',
      idCliente:'',
      estado: '-1' // Valor por defecto para el estado
    });
    this.venS.getVentasLista().subscribe(resp =>{
      this.apiVentas = resp;
      this.calcularTotales();
    });
  }

  obtenerEstadisticas(): void {
    this.venS.getEstadisticasRazDetventas().subscribe({
      next: (data) => {
        // Procesar estadísticas de reses
        if (data.mayorReses && data.menorReses) {
          this.mayorReses = data.mayorReses;
          this.menorReses = data.menorReses;
        } else {
          this.mensajeReses = data.reses || 'No se encontraron estadísticas para reses.';
        }
  
        // Procesar estadísticas de cerdos
        if (data.mayorCerdos && data.menorCerdos) {
          this.mayorCerdos = data.mayorCerdos;
          this.menorCerdos = data.menorCerdos;
        } else {
          this.mensajeCerdos = data.cerdos || 'No se encontraron estadísticas para cerdos.';
        }
      },
      error: (err) => {
        console.error('Error al obtener las estadísticas de ventas por razas:', err);
      },
    });
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
  
          // Inicializamos los totales
          let totalAnimales = this.totalcanani || 0;
          let totalImporte = this.totalven || 0;
  
          // Filas para la tabla, utilizando datos de apiVentas
          const tableBody = [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'FECHA', style: 'tableHeader', alignment: 'center' },
              { text: 'Nº RECIBO', style: 'tableHeader', alignment: 'center' },
              { text: 'CLIENTES', style: 'tableHeader', alignment: 'center' },
              { text: 'CANT. ANIMALES', style: 'tableHeader', alignment: 'center' },
              { text: 'IMPORTE', style: 'tableHeader', alignment: 'center' }
            ]
          ];
  
          // Agregamos filas con datos de apiVentas
          this.apiVentas.forEach((ven, index) => {
            tableBody.push([
              { text: (index + 1).toString(), alignment: 'center', style: '' },
              { text: ven.fecven || '', alignment: 'center', style: '' },
              { text: ven.numven || '', alignment: 'center', style: '' },
              { text: ven.clientes?.nomcli || '', alignment: 'center', style: '' },
              { text: ven.canani.toString(), alignment: 'center', style: '' },
              { text: ven.impven.toString(), alignment: 'center', style: '' }
            ]);
          });
  
          // Agregar fila de totales
          tableBody.push([
            { text: '', alignment: 'center', style: ''  },
            { text: '', alignment: 'center', style: '' },
            { text: '', alignment: 'center', style: '' },
            { text: 'TOTAL', alignment: 'center', style: 'boldText' },
            { text: totalAnimales.toString(), alignment: 'center', style: '' },
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
                      { text: 'REPORTE DE VENTAS', style: 'title', alignment: 'center' },
                      { text: '\n' },
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto'],
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

  exportToExcelVentas(): void {
    // Formatea los datos a exportar
    const formattedData = this.apiVentas.map((ven: any, index: number) => ({
      '#': index + 1,
      'FECHA': ven.fecven,
      'Nº RECIBO': ven.numven,
      'CLIENTES': ven.clientes.nomcli,
      'CANT. ANIMALES': ven.canani,
      'IMPORTE': ven.impven,
    }));
  
    // Crea un libro de trabajo y una hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Agrega un título en la primera fila
    XLSX.utils.sheet_add_aoa(worksheet, [['Reporte de Ventas']], { origin: 'A1' });
  
    // Agrega los datos formateados empezando en la fila 3
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3', skipHeader: false });
  
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
  
    // Exporta el archivo Excel
    const fileName = 'reporte_ventas.xlsx';
    XLSX.writeFile(workbook, fileName);
  }
  

  
  


}
