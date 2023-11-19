import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  @Input() modulo: string | undefined;
  @Input() mostrar: boolean = false;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  regresar(): void{
    Swal.fire({
      text: 'Esto cancelará las operaciones en curso ¿Seguro que desea ir al inicio?',
      iconHtml: '<img src="assets/img/warning.png" class="w-75 ms-3">',
      customClass: {
        icon: 'no-bordes',
        htmlContainer: 'text-warning fw-bold'
      },
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd'
    }).then(resp => {
      if (resp.value) {
        this.router.navigateByUrl('principal');
      }
    });
  }
}
