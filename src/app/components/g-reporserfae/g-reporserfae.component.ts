import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/service/clientes.service';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-g-reporserfae',
  templateUrl: './g-reporserfae.component.html',
  styleUrls: ['./g-reporserfae.component.css']
})
export class GReporserfaeComponent implements OnInit {

  apiSerfaena: any;
  formBusqueda: FormGroup;
  apiDetserfa: any;
  apiClientes: any;

  totalserfa: number = 0;


razaMayor: string = '';
  totalMayor: number = 0;
  razaMenor: string = '';
  totalMenor: number = 0;
  mensaje: string = '';  

  constructor(
    private formBuilder : FormBuilder,
    private serfaS : ServiciofaenaService,
    private cliS: ClientesService,
    private http: HttpClient,
  ) {
    this.serfaS.getServiciofaenaLista().subscribe(response =>{
      this.apiSerfaena = response;
      this.calcularTotales()
    });
    this.serfaS.getDetserfaLista().subscribe(response =>{
      this.apiDetserfa = response;
    });
  }

  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      numFaena: [''],
      idCliente:[''],
      estado: ['-1', [Validators.required]]

    });
    this.cargarClientes();
    this.obtenerEstadisticas();
  }

  calcularTotales() {
    this.totalserfa= 0; // Reiniciar totales a cero
  
    if (this.apiSerfaena && this.apiSerfaena.length > 0) {
      this.totalserfa = this.apiSerfaena.reduce((acc, ser) => acc + (ser.impser || 0), 0);
      
    }
  }
  
  cargarClientes(): void {
    this.cliS.getClientesLista().subscribe(respo => {
      this.apiClientes = respo;
    });
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

  buscarServicioFaena() {
    let { fechaInicio, fechaFin, numFaena, idCliente, estado } = this.formBusqueda.value;

    if (fechaInicio && fechaInicio instanceof Date) {
      fechaInicio = fechaInicio.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    if (fechaFin && fechaFin instanceof Date) {
      fechaFin = fechaFin.toISOString().split('T')[0]; // Convertir a formato adecuado
    }
    this.serfaS.buscarServicioFaena(fechaInicio, fechaFin, numFaena, idCliente, estado).subscribe(
      response => {
        this.apiSerfaena = response;
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
      numFaena: '',
      idCliente:'',
      estado: '-1' // Valor por defecto para el estado
    });
    this.serfaS.getServiciofaenaLista().subscribe(resp =>{
      this.apiSerfaena = resp;
      this.calcularTotales();
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
          let totalServicios = this.totalserfa || 0;
  
          // Filas para la tabla, utilizando datos de apiSerfaena
          const tableBody = [
            [
              { text: '#', style: 'tableHeader', alignment: 'center' },
              { text: 'FECHA', style: 'tableHeader', alignment: 'center' },
              { text: 'Nº RECIBO', style: 'tableHeader', alignment: 'center' },
              { text: 'CLIENTES', style: 'tableHeader', alignment: 'center' },
              { text: 'IMPRESO', style: 'tableHeader', alignment: 'center' },
              { text: 'ESTADO', style: 'tableHeader', alignment: 'center' }
            ]
          ];
  
          // Agregamos filas con datos de apiSerfaena
          this.apiSerfaena.forEach((ser, index) => {
            tableBody.push([
              { text: (index + 1).toString(), alignment: 'center', style: '' },
              { text: ser.fecser || '', alignment: 'center', style: '' },
              { text: ser.numfae || '', alignment: 'center', style: '' },
              { text: ser.clientes?.nomcli || '', alignment: 'center', style: '' },
              { text: ser.impser || '', alignment: 'center', style: '' },
              {
                text: ser.estado === 1 ? 'Completo' : 'Pendiente',
                alignment: 'center',
                style: ser.estado === 1 ? 'estadoCompleto' : 'estadoPendiente'
              }
            ]);
          });
  
          // Agregar fila de totales
          tableBody.push([
            { text: '', alignment: 'center', style: '' },
            { text: '', alignment: 'center', style: '' },
            { text: '', alignment: 'center', style: '' },
            { text: '', alignment: 'center', style: '' },
            { text: 'TOTAL', alignment: 'center', style: 'boldText' },
            { text: totalServicios.toString(), alignment: 'center', style: '' }
          ]);
  
          // Obtener la fecha y hora actuales
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString(); // Formato de fecha
          const formattedTime = currentDate.toLocaleTimeString(); // Formato de hora
  
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
                      { text: 'REPORTE DE SERVICIOS DE FAENA', style: 'title', alignment: 'center' },
                      { text: '\n' },
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
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
              boldText: { bold: true },
              estadoCompleto: { color: 'green', bold: true },
              estadoPendiente: { color: 'red', bold: true }
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

  exportToExcelserfa(): void {
    // Formatea los datos a exportar
    const formattedData = this.apiSerfaena.map((ser: any, index: number) => ({
      '#': index + 1,
      'FECHA': ser.fecser,
      'Nº RECIBO': ser.numfae,
      'CLIENTES': ser.clientes.nomcli,
      'IMPRESO': ser.impser,
      'ESTADO': ser.estado === 1 ? 'Completo' : 'Pendiente'
    }));
  
    // Crea un libro de trabajo y una hoja de trabajo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // Agrega un título en la primera fila
    XLSX.utils.sheet_add_aoa(worksheet, [['Reporte de Servicio de Faena']], { origin: 'A1' });
  
    // Agrega los datos formateados empezando en la fila 3
    XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3', skipHeader: false });
  
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicio de Faena');
  
    // Exporta el archivo Excel
    const fileName = 'reporte_servicio_faena.xlsx';
    XLSX.writeFile(workbook, fileName);
  }
  
  
  

  

}
