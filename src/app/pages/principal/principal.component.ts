import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';
import { RefreshToken } from '../../models/refreshToken.model';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  titulo = 'Administración';
  objeto!: RefreshToken;
  
  constructor(private loginService: LoginService,
              private router: Router) 
  { }
  
  ngOnInit(): void {
  }
  
  salir(): void {
    Swal.fire({
      text: '¿Seguro que desea cerrar su sesión?',
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
        this.objeto = {
          tokenValue: localStorage.getItem('refreshToken'),
          userId: localStorage.getItem('userId'),
          dateIssued: this.loginService.traerFechaString(1),
          dateExpired: this.loginService.traerFechaString(1)
        }

        this.loginService.logout(this.objeto).subscribe();
        localStorage.clear();
        this.router.navigateByUrl('login');
      }
    });
  }
}
