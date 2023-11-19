import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginReq } from 'src/app/models/loginreq.model';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login!: FormGroup;
  mensaje = 'Campo obligatorio';
  informacion: LoginReq | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private loginService: LoginService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {}

  get usuarioObligatorio(): boolean {
    return (
      this.login.get('Usuario')?.touched &&
      this.login.get('Usuario')?.errors?.['required']
    );
  }

  get claveObligatoria(): boolean {
    return (
      this.login.get('Clave')?.touched &&
      this.login.get('Clave')?.errors?.['required']
    );
  }

  crearFormulario(): void {
    this.login = this.fb.group({
      Usuario: ['', Validators.required],
      Clave: ['', Validators.required],
    });
  }

  ingresar(): void {
    if (this.login.invalid) {
      return Object.values(this.login.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    this.informacion = {
      email: this.login.controls['Usuario'].value,
      pwd: this.login.controls['Clave'].value,
    };

    this.loginService.login(this.informacion)
    .subscribe(resp => {
      if (resp.accessToken != undefined) {
        localStorage.setItem('token', resp.accessToken);
        localStorage.setItem('refreshToken', resp.refreshToken);
        localStorage.setItem('exp', resp.exp);
        localStorage.setItem('nbf', resp.nbf);
        localStorage.setItem('expRt', resp.expRt);
        localStorage.setItem('accessTokenExpiresIn', resp.accessTokenExpiresIn);
        localStorage.setItem('refreshTokenExpiresIn', resp.refreshTokenExpiresIn);
        localStorage.setItem('userId', resp.userId);
        this.router.navigateByUrl('principal');
      } else {
        Swal.fire({
          text: 'Usuario y/o contraseña no validos',
          iconHtml: '<img src="assets/img/error.png" class="w-75 ms-3">',
          customClass: {
            icon: 'no-bordes'
          },
          allowOutsideClick: false,
          showCloseButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  borrar(): void {
    this.login.reset();
  }
}
