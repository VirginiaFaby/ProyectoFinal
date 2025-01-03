import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/service/granjas.service';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { TiposerviciosService } from 'src/app/service/tiposervicios.service';

import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';





@Component({
  selector: 'app-g-reporguia',
  templateUrl: './g-reporguia.component.html',
  styleUrls: ['./g-reporguia.component.css']
})
export class GReporguiaComponent implements OnInit {

  apiGuiasenasag : any;
  apiguiasenasag: any[] = []; // Inicializamos como un array vacío
  resultados: any[] = []; // Cambia 'any' por el tipo adecuado si tienes uno

  formBusqueda: FormGroup;
  totalAnimales: number = 0;
  totalHembras: number = 0;
  totalMachos: number = 0;
  totalIngreso: number = 0;


  apiTiposervicios: any[] = [];
  apiDepartamentos: any[] = [];
  apiGranjas: any[] = [];

  
  constructor(
    private modalService : NgbModal,
    private formBuilder : FormBuilder,
    private guiaS : GuiasenasagService,
    private http: HttpClient,
    private graS: GranjasService,
    private tipserS: TiposerviciosService,

  ) {
    this.guiaS.getGuiasenasagLista().subscribe(resp =>{
      this.apiGuiasenasag = resp;
      this.calcularTotales();
    });

  }

  ngOnInit(): void {

    this.formBusqueda = this.formBuilder.group({
      fechaInicio: [''],
      fechaFin: [''],
      idGranja: [''],
      idDepartamento: [''],
      idTipoServicio: [''],
      estado: ['-1', [Validators.required]]

    });
      // Cargar listas de granjas, departamentos y tipos de servicio
      this.cargarGranjas();
      this.cargarDepartamentos();
      this.cargarTiposServicios();

  }

  cargarGranjas(): void {
    this.guiaS.getGranjasLista().subscribe(respo => {
      this.apiGranjas = respo;
    });
  }

  cargarDepartamentos(): void {
    this.guiaS.getDepartamentoslistar().subscribe(resp => {
      this.apiDepartamentos = resp;
      console.log('Departamentos cargados:', this.apiDepartamentos);
    });
  }

  cargarTiposServicios(): void {
    this.guiaS.getTiposerviciosLista().subscribe(respo => {
      this.apiTiposervicios = respo;
    });
  }

  calcularTotales() {

    // Aseguramos que apiGuiasenasag tenga datos antes de hacer el cálculo
    this.totalAnimales = 0; // Reiniciar totales a cero
    this.totalHembras = 0;
    this.totalMachos = 0;
    this.totalIngreso = 0;
    // Aseguramos que apiGuiasenasag tenga datos antes de hacer el cálculo
    if (this.apiGuiasenasag && this.apiGuiasenasag.length > 0) {
      this.totalAnimales = this.apiGuiasenasag.reduce((acc, guia) => acc + (guia.totani || 0), 0);
      this.totalHembras = this.apiGuiasenasag.reduce((acc, guia) => acc + (guia.tothem || 0), 0);
      this.totalMachos = this.apiGuiasenasag.reduce((acc, guia) => acc + (guia.totmac || 0), 0);
      this.totalIngreso = this.apiGuiasenasag.reduce((acc, guia) => acc + (guia.ingguia || 0), 0);
    }
  }

  buscarPorFechas(): void {
    const { fechaInicio, fechaFin, idGranja, idDepartamento, idTipoServicio, estado } = this.formBusqueda.value;
    
    this.guiaS.buscarGuiasPorFechas(fechaInicio, fechaFin, idGranja, idDepartamento, idTipoServicio, estado)
      .subscribe(resp => {
        this.apiGuiasenasag = resp;
        this.calcularTotales(); // Recalcular totales después de la búsqueda
        console.log(resp);
      }, error => {
        console.error('Error al buscar guías:', error);
      });
  }

    // Método para restablecer el formulario
    restablecerFormulario(): void {
      this.formBusqueda.reset({
        fechaInicio: '',
        fechaFin: '',
        idGranja: '',
        idDepartamento: '',
        idTipoServicio: '',
        estado: '-1' // Valor por defecto para el estado
      });
      this.guiaS.getGuiasenasagLista().subscribe(resp =>{
        this.apiGuiasenasag = resp;
        this.calcularTotales();
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
    
            // Inicializamos los totales
            let totalAnimales = 0;
            let totalHembras = 0;
            let totalMachos = 0;
            let totalIngresos = 0;
    
            // Filas para la tabla, utilizando datos de apiGuiasenasag
            const tableBody = [
              [
                { text: 'Fecha', style: 'tableHeader', alignment: 'center' },
                { text: 'Nº Guía', style: 'tableHeader', alignment: 'center' },
                { text: 'Granja', style: 'tableHeader', alignment: 'center' },
                { text: 'Departamento', style: 'tableHeader', alignment: 'center' },
                { text: 'Tipo Servicio', style: 'tableHeader', alignment: 'center' },
                { text: 'Total Animales', style: 'tableHeader', alignment: 'center' },
                { text: 'Total Hembras', style: 'tableHeader', alignment: 'center' },
                { text: 'Total Machos', style: 'tableHeader', alignment: 'center' },
                { text: 'Total Ingreso', style: 'tableHeader', alignment: 'center' }
              ]
            ];
    
            // Agregamos filas con datos
            this.apiGuiasenasag.forEach(guia => {
              totalAnimales += guia.totani || 0;
              totalHembras += guia.tothem || 0;
              totalMachos += guia.totmac || 0;
              totalIngresos += guia.ingguia || 0;
    
              tableBody.push([
                { text: guia.feclle || '', alignment: 'center', style: 'title' },
                { text: guia.nroguia || '', alignment: 'center', style: 'title' },
                { text: guia.granjas.nomgra || '', alignment: 'center', style: 'title' },
                { text: guia.departamentos.nomdep || '', alignment: 'center', style: 'title' },
                { text: guia.tiposervicios.nomser || '', alignment: 'center', style: 'title' },
                { text: guia.totani || 0, alignment: 'center', style: 'title' },
                { text: guia.tothem || 0, alignment: 'center', style: 'title' },
                { text: guia.totmac || 0, alignment: 'center', style: 'title'},
                { text: guia.ingguia || 0, alignment: 'center', style: 'title' }
              ]);
            });
    
            // Agregar fila de totales
            tableBody.push([
              { text: '', alignment: 'center', style: 'title' },
              { text: '', alignment: 'center', style: 'title' },
              { text: '', alignment: 'center', style: 'title' },
              { text: '', alignment: 'center', style: 'title' },
              { text: 'TOTAL', alignment: 'center', style: 'boldText' },
              { text: totalAnimales.toString(), alignment: 'center', style: 'title' },
              { text: totalHembras.toString(), alignment: 'center', style: 'title' },
              { text: totalMachos.toString(), alignment: 'center', style: 'title' },
              { text: totalIngresos.toString(), alignment: 'center', style: 'title' }
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
                        { text: 'REPORTE DE GUIAS SENASAG', style: 'title', alignment: 'center' },
                        { text: '\n' },
                        {
                          table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
                title: { fontSize: 10, bold: true },
                subTitle: { fontSize: 9, bold: true },
                text: { fontSize: 8 },
                tableHeader: { fontSize: 8, bold: true, fillColor: '#eeeeee' },
                boldText: { fontSize: 8, bold: true }
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
    


    exportToExcelGuiaSenasag(): void {
      // Formatea los datos a exportar
      const formattedData = this.apiGuiasenasag.map((guia: any, index: number) => ({
        '#': index + 1,
        'FECHA': guia.feclle,
        'N° GUIA': guia.nroguia,
        'GRANJA': guia.granjas.nomgra,
        'DEPARTAMENTO': guia.departamentos.nomdep,
        'TIPO SERVICIO': guia.tiposervicios.nomser,
        'CANT. HEMBRAS': guia.tothem,
        'CANT. MACHOS': guia.totmac,
        'TOTAL ANIMALES': guia.totani,
        'TOTAL INGRESO': guia.ingguia,
        'ESTADO': guia.estado === 1 ? 'Completo' : 'Pendiente'
      }));
    
      // Crea un libro de trabajo y una hoja de trabajo
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    
      // Agrega un título en la primera fila
      XLSX.utils.sheet_add_aoa(worksheet, [['Reporte de Guías SENASAG']], { origin: 'A1' });
    
      // Agrega los datos formateados empezando en la fila 3
      XLSX.utils.sheet_add_json(worksheet, formattedData, { origin: 'A3', skipHeader: false });
    
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Guías SENASAG');
    
      // Exporta el archivo Excel
      const fileName = 'reporte_guias_senasag.xlsx';
      XLSX.writeFile(workbook, fileName);
    }
    
    
    
    

}

