import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Roles } from 'src/app/models/roles.model';
import { RolesService } from 'src/app/services/roles.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-listar-roles',
  templateUrl: './listar-roles.component.html',
  styleUrls: ['./listar-roles.component.css']
})
export class ListarRolesComponent implements OnInit {

  titulo = 'Consulta de roles';
  mensajeDesactivacion = 'Al desactivar un rol los usuarios que lo tenían asignado perderán los permisos ' +
                         'relacionados con el rol, sin embargo las configuraciones de rol se conservarán y ' +
                         'si en el futuro se reactiva los usuarios recuperarán los permisos del rol';
  mensajeActivacion = 'Al reactivar un rol, éste será restablecido para todos los usuarios que lo tenían ' +
                      'asignado, quienes podrán nuevamente usarlo en las mismas funcionalidades que lo ' +
                      'tenían en el momento de la inactivación del rol';
  errorAccion = 'La acción solicitada no se pudo completar';
  rolVacio = 'El nombre del rol no puede estar vacio';
  rolExistente = 'El nombre del rol ya existe';
  errorEdicion = 'El rol no pudo ser editado';
  errorCreacion = 'El rol no pudo ser creado';
  roles: Roles[] = [];
  rol: Roles | undefined;
  pagina = 1;
  dato = null;
  mostrar = false;
  nuevoNombre: string | undefined;
  nuevoRol: string | undefined;
  
  constructor(private rolesService: RolesService) { }

  ngOnInit(): void {
    this.cargarRoles();

    $("#cancel").on("click", function() {
      $("#caja").val('');
    });
  }

  cargarRoles(): void{
    this.rolesService.traerRoles()
    .subscribe(resp => {
      this.roles = resp;
    });
  }

  borrar(): void{
    this.cargarRoles();
  }
  
  buscar(texto: string): void{
    this.rolesService.traerRol(texto)
    .subscribe(resp => {
      this.roles = resp;
    });
  }

  mostrarBotones(num: any, nombre: string): void{
    this.dato = num;
    this.nuevoNombre = nombre.trim();
  }

  botonCancelar(): void{
    this.dato = null;
  }

  botonesCrearRol(): void{
    this.mostrar = true;
  }

  cancelarRol(): void{
    this.mostrar = false;
  }

  desactivarRol(tipo: Roles): void{
    this.ventanaEmergenteWarning(this.mensajeDesactivacion)
    .then(resp => {
      if (resp.value) {
        this.rolesService.desactivarRol(tipo.rolId!)
        .subscribe(rta => {
          if (rta == 1) {
            this.ventanaEmergenteExito();
            this.cargarRoles();
          } else {
            this.ventanaEmergenteError(this.errorAccion);
          }
        });
      }
    });
  }

  activarRol(tipo: Roles): void{
    this.ventanaEmergenteWarning(this.mensajeActivacion)
    .then(resp => {
      if (resp.value) {
        this.rolesService.activarRol(tipo.rolId!)
        .subscribe(rta => {
          if (rta == 1) {
            this.ventanaEmergenteExito();
            this.cargarRoles();
          } else {
            this.ventanaEmergenteError(this.errorAccion);
          }
        });
      }
    });
  }

  editarRol(id: number, nombre: string, codigo: string, estado: boolean): void{
    if (nombre == "") {
      this.ventanaEmergenteError(this.rolVacio);
    } else {
      this.rolesService.revisarRol(nombre)
      .subscribe(resp => {
        if (resp > 0) {
          this.ventanaEmergenteError(this.rolExistente);
        } else {
          this.rol = {
            rolId: id,
            rolName: nombre,
            codigo: codigo,
            estado: estado
          }
    
          this.rolesService.actualizarRol(this.rol)
          .subscribe(resp => {
            if (resp == 1) {
              this.ventanaEmergenteExito();
              this.dato = null;
              this.cargarRoles();
            } else {
              this.ventanaEmergenteError(this.errorEdicion);
            }
          });
        }
      });
    }
  }

  crearRol(nombre: string): void{
    if (nombre == "" || nombre == undefined) {
      this.ventanaEmergenteError(this.rolVacio);
    } else {
      this.rolesService.revisarRol(nombre)
      .subscribe(resp => {
        if (resp > 0) {
          this.ventanaEmergenteError(this.rolExistente);
        } else {
          this.rol = {
            rolId: 0,
            rolName: nombre,
            codigo: "",
            estado: true
          }
    
          this.rolesService.crearRol(this.rol)
          .subscribe(resp => {
            if (resp == 1) {
              this.ventanaEmergenteExito();
              this.mostrar = false;
              this.cargarRoles();
            } else {
              this.ventanaEmergenteError(this.errorCreacion);
            }
          });
        }
      });
    }
  }

  ventanaEmergenteWarning(mensaje: string): Promise<SweetAlertResult>{
    let respuesta =
    Swal.fire({
      html: `${ mensaje }` + 
            '<h4 class="text-warning fw-bold mt-3">¿Desea continuar?</h4>',
      iconHtml: '<img src="assets/img/warning.png" class="w-75 ms-2">',
      customClass: {
        icon: 'no-bordes'
      },
      allowOutsideClick: false,
      showCloseButton: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd'
    });
    return respuesta;
  }

  ventanaEmergenteExito(): void{
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
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });
  }

  ventanaEmergenteError(mensaje: string): void{
    Swal.fire({
      title: 'Operación no exitosa',
      text: mensaje,
      iconHtml: '<img src="assets/img/error.png" class="w-75 ms-2">',
      customClass: {
        icon: 'no-bordes',
        title: 'text-danger'
      },
      allowOutsideClick: false,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });
  }
}
