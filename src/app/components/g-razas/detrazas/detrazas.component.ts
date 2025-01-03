import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Razas } from 'src/app/model/razas.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { RazasService } from 'src/app/service/razas.service';

@Component({
  selector: 'app-detrazas',
  templateUrl: './detrazas.component.html',
  styleUrls: ['./detrazas.component.css']
})
export class DetrazasComponent implements OnInit {

  form: FormGroup;
  razasI: Razas;
  tipoanimalI: Tipoanimal;
  apiRazas: any;
  apiTipoanimal: any;
  index = 0;
  submitted = false;
  pageActual: number = 1;
  modalReference: NgbModalRef;

  selectedFiles: FileList;
  fotom: string;
  fotoh: string;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private razS: RazasService,
    private aniS: AnimalesService,
  ) {
    this.razS.getRazasLista().subscribe(response => {
      this.apiRazas = response;
    });
    this.aniS.getTipoAnimalesLista().subscribe(respo => {
      this.apiTipoanimal = respo;
    });
  }

  listarRazas() {
    this.razS.getRazasLista().subscribe(repos => {
      this.apiRazas = repos;
    })
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomraz: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z ]+$/)]],
      carraz: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(150)]],
      pesprom: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      pesproh: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      prerefm: ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]],
      prerefh: ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]],
      fotom: ['', []],
      fotoh: ['', []],
      tipoanimal: ['', [Validators.required]],

    });
  }
  get f() { return this.form.controls; }
  /*
  llamaModalMod(modal, raz : Razas){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset({nomraz: raz.nomraz, carraz: raz.carraz, mascorm: raz.mascorm, mascorh: raz.mascorh, prerefm: raz.prerefm, prerefh: raz.prerefh, 
    fotom: `./assets/${raz.fotom}`, 
    fotoh:`./assets/${raz.fotoh}`, tipoanimal: raz.tipoanimal.idtip});
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal); 
    this.index = raz.idraz; 
  }
*/
  auxfotoh:String;
  auxfotom:String;

  llamaModalMod(modal, raz: Razas) {
    this.submitted = false;
    console.log(raz.fotoh)
    //inicializar valores del formulario
    this.form.reset({
      nomraz: raz.nomraz, carraz: raz.carraz, pesprom: raz.pesprom, pesproh: raz.pesproh, prerefm: raz.prerefm, prerefh: raz.prerefh,
      fotom: raz.fotom, 
      fotoh: raz.fotoh, tipoanimal: raz.tipoanimal.idtip
    });
    this.auxfotoh=raz.fotoh;
    this.auxfotom=raz.fotom;
    
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal);
    this.index = raz.idraz;
  }
  //Para un Foto de Animales Machos  
  OnFileChange(event) {
    const file = event.target.files.item(0);
    console.log(file);
    this.fotom = file.name;
    if (file != null) {
      if (file.type.match('image.*')) {
        var size = event.target.files[0].size;
        if (size > 1000000) {
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
          this.form.get('foto').setValue("");
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
        this.form.get('fotoh').setValue("");
        alert('¡Formato de archivo inválido!');
      }
    } else {
      this.form.get('fotoh').setValue("");
      console.log("Se cancela una selección..");
    }
  }


  onSubmit() {

    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }
    for (let i = 0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    this.razasI = {
      idraz: 0,
      nomraz: (this.form.controls.nomraz.value).toUpperCase(),
      carraz: (this.form.controls.carraz.value),
      pesprom: (this.form.controls.pesprom.value),
      pesproh: (this.form.controls.pesproh.value),
      prerefm: (this.form.controls.prerefm.value),
      prerefh: (this.form.controls.prerefh.value),
      fotom: this.fotom,
      fotoh: this.fotoh,
      estado: 1,
      tipoanimal: this.tipoanimalI,

    }
    this.razS.modificarRazas(this.index, this.razasI).subscribe(response => {
      this.listarRazas();
    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
  }


  llamaModalDel(modal, raz: Razas) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.razasI = raz;
  }

  onSubmitDel() {
    this.submitted = true;
    this.razS.deleteRazas(this.razasI.idraz).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.listarRazas();

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }
  //modal Habilitar 
  llamaModalHab(modal, raz: Razas) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.razasI = raz;
  }

  onSubmitHab() {
    this.submitted = true;
    this.razS.habilitarRazas(this.razasI.idraz).subscribe(
      response => {
        console.log("Habilitacion correcta");
        this.listarRazas();

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  //filtro
  onChangeFiltroNombre(xnomraz: string, xidtip: number, xestado: number): void {
    this.razS.ListaRazasNom(xnomraz, xidtip, xestado).subscribe(respo => {
      console.log(xestado + ' entro');
      this.apiRazas = respo;
    },
      error => {
        console.error('Error al obtener tipos de servicios:', error);
      }
    );
  }

}
