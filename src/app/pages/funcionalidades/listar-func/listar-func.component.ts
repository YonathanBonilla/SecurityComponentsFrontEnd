import { Component, OnInit } from '@angular/core';
import { FuncionalidadRolesService } from '../../../services/funcionalidad-roles.service';
import { FuncionalidadRolesFull } from '../../../models/funcionalidadRolesFull.model';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listar-func',
  templateUrl: './listar-func.component.html',
  styleUrls: ['./listar-func.component.css']
})
export class ListarFuncComponent implements OnInit {

  titulo = 'Consultar funcionalidad';
  mensajeDesactivacion = 'Al desactivar una funcionalidad, ningún usuario podrá ingresar ni realizar tareas ' + 
                         'en ella, sin embargo las configuraciones del usuario se conservarán, de modo que ' + 
                         'si en el futuro se reactiva la funcionalidad, los usuarios podrán ingresar ' + 
                         'nuevamente de acuerdo a los roles con los que cuenten';
  mensajeActivacion = 'Al reactivar una funcionalidad, los usuarios podrán ingresar nuevamente de acuerdo ' +
                      'con los roles con los que cuenten actualmente';
  funcionalidadRoles: any[] = [];
  lista: FuncionalidadRolesFull[] = [];
  objeto!: FuncionalidadRolesFull;
  roles = '';
  pagina = 1;
  
  constructor(private funcionalidadRolesService: FuncionalidadRolesService,
              private router: Router) 
  { }

  ngOnInit(): void {
    this.cargarFuncionalidadRoles();

    $("#cancel").on("click", function() {
      $("#caja").val('');
    });
  }

  cargarFuncionalidadRoles(): void{
    this.funcionalidadRolesService.traerFuncionalidadRoles()
    .subscribe(resp => {
      this.lista = [];
      this.roles = '';
      this.funcionalidadRoles = resp;
      this.funcionalidadRoles.forEach(item => {
        item.forEach((element: { rolName: string; }) => {
          this.roles = this.roles + '*' + element.rolName + ' ';
        });
        this.objeto = {
          funcionalityId: item[0].funcionalityId,
          codigo: item[0].codigo,
          codFunc: item[0].codFunc,
          nameFunc: item[0].nameFunc,
          rolId: 0,
          rolName: this.roles,
          state: item[0].state,
        }
        this.lista.push(this.objeto);
        this.roles = '';
      });
    });
  }

  borrar(): void{
    this.cargarFuncionalidadRoles();
  }
  
  buscar(texto: string): void{
    this.funcionalidadRolesService.consultarFuncionalidadRoles(texto)
    .subscribe(resp => {
      this.lista = [];
      this.roles = '';
      this.funcionalidadRoles = resp;
      if (resp.length != 0) {
        this.funcionalidadRoles.forEach(item => {
          this.roles = this.roles + '* ' + item.rolName + ' ';
        });
        this.objeto = {
          funcionalityId: this.funcionalidadRoles[0].funcionalityId,
          codigo: this.funcionalidadRoles[0].codigo,
          codFunc: this.funcionalidadRoles[0].codFunc,
          nameFunc: this.funcionalidadRoles[0].nameFunc,
          rolId: 0,
          rolName: this.roles,
          state: this.funcionalidadRoles[0].state,
        }
        this.lista.push(this.objeto);
      }
    });
  }

  desactivarFuncionalidad(id: number): void{
    this.ventanaEmergenteWarning(this.mensajeDesactivacion)
    .then(resp => {
      if (resp.value) {
        this.funcionalidadRolesService.desactivarFuncionalidadRoles(id)
        .subscribe(rta => {
          if (rta == 1) {
            this.ventanaEmergenteExito();
            this.cargarFuncionalidadRoles();
          } else {
            this.ventanaEmergenteError();
          }
        });
      }
    });
  }

  activarFuncionalidad(id: number): void{
    this.ventanaEmergenteWarning(this.mensajeActivacion)
    .then(resp => {
      if (resp.value) {
        this.funcionalidadRolesService.activarFuncionalidadRoles(id)
        .subscribe(rta => {
          if (rta == 1) {
            this.ventanaEmergenteExito();
            this.cargarFuncionalidadRoles();
          } else {
            this.ventanaEmergenteError();
          }
        });
      }
    });
  }

  crearFuncionalidad(): void{
    this.router.navigateByUrl('funcionalidades/crear-funcionalidad');
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

  ventanaEmergenteError(): void{
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
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });
  }
}
