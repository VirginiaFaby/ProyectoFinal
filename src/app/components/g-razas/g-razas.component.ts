import { Component, OnInit, ViewChild } from '@angular/core';
import { DetrazasComponent } from './detrazas/detrazas.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Razas } from 'src/app/model/razas.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RazasService } from 'src/app/service/razas.service';

import { AnimalesService } from 'src/app/service/animales.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';

@Component({
  selector: 'app-g-razas',
  templateUrl: './g-razas.component.html',
  styleUrls: ['./g-razas.component.css']
})
export class GRazasComponent implements OnInit {
  @ViewChild(DetrazasComponent) detalleRazas: DetrazasComponent;

  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  razasI: Razas;
  apiRazas: any;
  apiTipoanimal: any;
  modalReference: NgbModalRef;
  tipoanimalI: Tipoanimal;
  selectedFiles: FileList;
  fotom : string;
  fotoh : string;


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private razS: RazasService,
    private aniS: AnimalesService
  ) {
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomraz      : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z ]+$/)]],
      carraz      : ['', [Validators.required, Validators.minLength(30), Validators.maxLength(150)]],
      pesprom     : ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      pesproh     : ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      prerefm     : ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]],
      prerefh     : ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]],
      fotom       : ['', []],
      fotoh       : ['', []],
      tipoanimal  : ['', [Validators.required]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      idtip  : ['-1'],
      estadoRaz: ['-1', [Validators.required]],
    });
  }

  get f() {return this.form.controls;}
  get f2() {return this.formFiltro.controls;}

  llamaModalAdd(modal) {
    this.submitted = false;
    this.form.reset([{nomraz:''},{carraz:''},{pesprom:''}, {pesproh:''}, {prerefm:''}, {prerefh:''}, {fotom:''}, {fotoh:''}]);
    //this.modalReference = this.modalService.open(modal, { size: 'lg' }); 
    this.modalReference = this.modalService.open(modal); 
  }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const idtip = this.formFiltro.value.idtip;
    const estadoRaz = this.formFiltro.value.estadoRaz;
    console.log("filtrar..");
    this.detalleRazas.onChangeFiltroNombre(filtro, idtip, estadoRaz);

    this.razS.ListaRazasNom(filtro, idtip, estadoRaz). subscribe(respon =>{
      this.apiRazas = respon;
    });
  }

//Para un Foto de Animales Machos  
  OnFileChange(event) {
    const file = event.target.files.item(0); 
    console.log(file);
    this.fotom=file.name;
    if (file != null) {
        if (file.type.match('image.*')) {
            var size = event.target.files[0].size;  
            if(size > 1000000) {
                alert("El tamaño no debe exceder 1 MB");  
                this.form.get('foto').setValue("");  
            } else {  
                this.selectedFiles = event.target.files;  

                // Integración de la función para vista previa
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imagePreview = document.getElementById('imagenPrevia1') as HTMLImageElement; // Cast a HTMLImageElement
                    imagePreview.src = e.target.result as string; // Cast a string
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }  
        } else {  
            this.form.get('fotom').setValue("");
            alert('¡Formato de archivo inválido!');  
        }  
    } else {
        this.form.get('fotom').setValue("");
        console.log("Se cancela una selección..");
    }
}
//Para un Foto de Animales Hembras  
onFileChange(event) {
  const file = event.target.files.item(0);
  console.log(file);
  this.fotoh = file.name;
  if (file != null) {
      if (file.type.match('image.*')) {
          var size = event.target.files[0].size;
          if (size > 1000000) {
              alert("El tamaño no debe exceder 1 MB");
              this.form.get('fotoh').setValue(""); // Ajuste aquí
          } else {
              this.selectedFiles = event.target.files;

              // Integración de la función para vista previa
              const reader = new FileReader();
              reader.onload = (e) => {
                  const imagePreview = document.getElementById('imagenPrevia2') as HTMLImageElement; // Cast a HTMLImageElement
                  imagePreview.src = e.target.result as string; // Cast a string
                  imagePreview.style.display = 'block';
              };
              reader.readAsDataURL(file);
          }
      } else {
          this.form.get('fotoh').setValue(""); // Ajuste aquí
          alert('¡Formato de archivo inválido!');
      }
  } else {
      this.form.get('fotoh').setValue(""); // Ajuste aq uí
      console.log("Se cancela una selección..");
  }
}
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    for (let i =  0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    this.razasI = {
      idraz:  0,
      nomraz: (this.form.controls.nomraz.value).toUpperCase(),
      carraz: (this.form.controls.carraz.value),
      pesprom: (this.form.controls.pesprom.value),
      pesproh: (this.form.controls.pesproh.value),
      prerefm: (this.form.controls.prerefm.value),
      prerefh: (this.form.controls.prerefh.value),
      fotom:   this.fotom,
      fotoh:   this.fotoh,
      estado:  1,
      tipoanimal: this.tipoanimalI,
    };

    this.razS.saveRazas(this.razasI).subscribe(
      (response) => {
        this.detalleRazas.listarRazas();
      },
      (error) => {
        console.log("error while saving data in the DB");
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadoRaz.setValue('-1');
        this.detalleRazas.onChangeFiltroNombre('', -1, -1);
      }
    );
    this.modalReference.close();
  }
}
