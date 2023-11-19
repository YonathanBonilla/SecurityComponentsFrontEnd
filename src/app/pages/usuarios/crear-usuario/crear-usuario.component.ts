import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  titulo = 'Crear usuario';
  formulario!: FormGroup;
  mensaje = 'Campo obligatorio';
  datos!: Usuarios;

  constructor(private fb: FormBuilder,
              private usuariosService: UsuariosService,
              private router: Router)
  { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  get correoObligatorio(): boolean {
    return (
      this.formulario.get('Correo')?.touched &&
      this.formulario.get('Correo')?.errors?.['required']
    );
  }

  get passwordObligatorio(): boolean {
    return (
      this.formulario.get('Password')?.touched &&
      this.formulario.get('Password')?.errors?.['required']
    );
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      Correo: ['', Validators.required],
      Password: ['', Validators.required],
      Nombres: [''],
      Apellidos: [''],
      Usuario: [''],
      Cargo: [''],
      Area: ['']
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    Swal.fire({
      text: '¿Seguro que desea crear el usuario?',
      iconHtml: '<img src="assets/img/warning.png" class="w-75 ms-3">',
      customClass: {
        icon: 'no-bordes',
        htmlContainer: 'text-warning fw-bold'
      },
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then(resp => {
      if (resp.value) {
        this.datos = {
          inicio: false,
          adUserId: 0,
          email: this.formulario.controls['Correo'].value,
          pwd: this.formulario.controls['Password'].value,
          adId: '0',
          firtsName: this.formulario.controls['Nombres'].value,
          lastName: this.formulario.controls['Apellidos'].value,
          userName: this.formulario.controls['Usuario'].value,
          position: this.formulario.controls['Cargo'].value,
          area: this.formulario.controls['Area'].value
        }
    
        this.usuariosService.guardarUsuario(this.datos)
        .subscribe(resp => {
          if (resp == 1) {
            Swal.fire({
              title: 'Operación exitosa',
              iconHtml: '<img src="assets/img/success.png" class="w-75 ms-2">',
              customClass: {
                icon: 'no-bordes',
                title: 'text-success'
              },
              allowOutsideClick: false,
              showCloseButton: true,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            });
            this.router.navigateByUrl('principal');
          } else {
            Swal.fire({
              title: 'Operación no exitosa',
              text: 'La acción solicitada no se pudo completar',
              iconHtml: '<img src="assets/img/error.png" class="w-75 ms-2">',
              customClass: {
                icon: 'no-bordes',
                title: 'text-danger'
              },
              allowOutsideClick: false,
              showCloseButton: true,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  borrar(): void {
    this.formulario.reset();
  }
}
