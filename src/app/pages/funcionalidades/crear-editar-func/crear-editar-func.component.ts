import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuncionalidadesService } from '../../../services/funcionalidades.service';
import { FuncionalidadRolesService } from '../../../services/funcionalidad-roles.service';
import { RolesService } from '../../../services/roles.service';
import { Funcionalidades } from '../../../models/funcionalidades.model';
import { RolesSingle } from '../../../models/rolesSingle.model';
import { FuncionalidadRolesFull } from '../../../models/funcionalidadRolesFull.model';
import { FuncionalidadRoles } from '../../../models/funcionalidadRoles.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-func',
  templateUrl: './crear-editar-func.component.html',
  styleUrls: ['./crear-editar-func.component.css']
})
export class CrearFuncComponent implements OnInit {

  titulo!: string;
  datoTabla!: string;
  mensaje = 'Campo obligatorio';
  mensajeRoles = 'Debe seleccionar al menos un rol';
  codigoExistente = 'El código de la funcionalidad ya existe';
  funcExistente = 'El nombre de la funcionalidad ya existe';
  errorGuardado = 'No se pudo hacer las asignaciones de los roles a la funcionalidad seleccionada';
  resultado: any[] = [];
  cadena: string[] = [];
  list_roles_origen: RolesSingle[] = [];
  list_roles_destino: RolesSingle[] = [];
  list_asignaciones: FuncionalidadRoles[] = [];
  tablaPrevisualizar!: FuncionalidadRolesFull;
  guardarAsignaciones!: FuncionalidadRoles;
  rolSolo!: RolesSingle;
  rolOrigen: RolesSingle | undefined;
  rolDestino: RolesSingle | undefined;
  formulario!: FormGroup;
  indiceRolOrigen: any;
  indiceRolDestino: any;
  funcionalidad: Funcionalidades | undefined;
  nombre: string | undefined;
  cadenaRoles = '';
  correcto = false;
  fecha!: Date;
  formato!: string;
  
  constructor(private funcionalidadesService: FuncionalidadesService,
              private funcionalidadRolesService: FuncionalidadRolesService,
              private rolesService: RolesService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) 
  { 
    this.nombre = this.route.snapshot.paramMap.get('nombre')?.toString();

    this.crearFormulario();
  }

  ngOnInit(): void {
    if (this.nombre != undefined) {
      this.titulo = 'Editar funcionalidad';
      this.datoTabla = 'editar';
      this.funcionalidadRolesService.consultarFuncionalidadRoles(this.nombre!)
      .subscribe(resp => {
        this.resultado = resp;
        this.resultado.forEach(item => {
          this.rolSolo = {
            rolId: item.rolId,
            rolName: item.rolName
          }
          this.list_roles_destino.push(this.rolSolo);
          this.cadena.push(item.rolName);
        });
        this.cargarFormulario();
      });
    } else {
      this.titulo = 'Crear nueva funcionalidad';
      this.datoTabla = 'crear';
    }
    this.cargarRoles();
  }

  get nombreObligatorio(): boolean{
    return this.formulario.get('Nombre')?.touched && this.formulario.get('Nombre')?.errors?.['required'];
  }

  get codigoTramiteObligatorio(): boolean{
    return this.formulario.get('CodigoTramite')?.touched && this.formulario.get('CodigoTramite')?.errors?.['required'];
  }

  crearFormulario(): void{
    this.formulario = this.fb.group({
      CodigoTramite: ['', Validators.required],
      Nombre: ['', Validators.required]
    });
  }

  cargarFormulario(): void {
    this.formulario.controls['CodigoTramite'].setValue(this.resultado[0].codFunc);
    this.formulario.controls['Nombre'].setValue(this.resultado[0].nameFunc);
  }

  cargarRoles(): void{
    this.rolesService.traerRoles()
    .subscribe(resp => {
      resp.forEach(item => {
        this.rolSolo = {
          rolId: item.rolId,
          rolName: item.rolName
        }
        this.list_roles_origen.push(this.rolSolo);
      });
    });
  }

  seleccionRolOrigen(e: any): void{
    this.indiceRolOrigen = e.target.value;
    this.rolOrigen = this.list_roles_origen.find(x => x.rolId == e.target.value);
  }

  seleccionRolDestino(e: any): void{
    this.indiceRolDestino = e.target.value;
    this.rolDestino = this.list_roles_origen.find(x => x.rolId == e.target.value);
  }

  agregarRol(): void{
    if (this.rolOrigen != undefined) {
      if (!this.cadena.includes(this.rolOrigen.rolName!)) {
        this.list_roles_destino.push(this.rolOrigen!);
        this.cadena.push(this.rolOrigen.rolName!);
      }
      this.indiceRolOrigen = 0;
      this.rolOrigen = undefined;
    }
  }

  quitarRol(): void{
    if (this.rolDestino != undefined) {
      this.list_roles_destino = this.list_roles_destino.filter(x => x.rolId != this.rolDestino?.rolId);
      this.cadena = this.cadena.filter(x => x != this.rolDestino?.rolName);
      this.indiceRolDestino = 0;
      this.rolDestino = undefined;
    }
  }

  editar(): void{
    this.correcto = false;
    this.formulario.get('CodigoTramite')?.enable();
    this.formulario.get('Nombre')?.enable();
    this.cadenaRoles = '';
  }

  verTablaPrevisualizar(): void{
    this.correcto = true;
    this.formulario.get('CodigoTramite')?.disable();
    this.formulario.get('Nombre')?.disable();
    this.cadena.forEach(item => {
      this.cadenaRoles = this.cadenaRoles + '*' + item + ' ';
    });
    this.tablaPrevisualizar = {
      funcionalityId: 0,
      codigo: '0',
      codFunc: this.formulario.get('CodigoTramite')?.value,
      nameFunc: this.formulario.get('Nombre')?.value,
      rolId: 0,
      rolName: this.cadenaRoles,
      state: false
    }
  }

  cancelar(): void{
    if (this.nombre != undefined) {
      this.router.navigateByUrl('funcionalidades');
    } else {
      this.router.navigateByUrl('principal');
    }
  }

  previsualizar(): void{
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if (this.list_roles_destino.length == 0) {
      this.ventanaEmergenteError(this.mensajeRoles);
    } else {
      if (this.nombre != undefined) {
        if (this.resultado[0].codFunc != this.formulario.get('CodigoTramite')?.value) {
          this.funcionalidadesService.revisarCodigoFuncionalidad(this.formulario.get('CodigoTramite')?.value)
          .subscribe(resp => {
            if (resp > 0) {
              this.ventanaEmergenteError(this.codigoExistente);
            } else {
              if (this.resultado[0].nameFunc != this.formulario.get('Nombre')?.value) {
                this.funcionalidadesService.revisarNombreFuncionalidad(this.formulario.get('Nombre')?.value)
                .subscribe(resp => {
                  if (resp > 0) {
                    this.ventanaEmergenteError(this.funcExistente);
                  } else {
                    this.verTablaPrevisualizar();
                  }
                });
              } else {
                this.verTablaPrevisualizar();
              }
            }
          });
        } else if (this.resultado[0].nameFunc != this.formulario.get('Nombre')?.value) {
          this.funcionalidadesService.revisarNombreFuncionalidad(this.formulario.get('Nombre')?.value)
          .subscribe(resp => {
            if (resp > 0) {
              this.ventanaEmergenteError(this.funcExistente);
            } else {
              this.verTablaPrevisualizar();
            }
          });
        } else {
          this.verTablaPrevisualizar();
        }
      } else {
        this.funcionalidadesService.revisarCodigoFuncionalidad(this.formulario.get('CodigoTramite')?.value)
        .subscribe(resp => {
          if (resp > 0) {
            this.ventanaEmergenteError(this.codigoExistente);
          } else {
            this.funcionalidadesService.revisarNombreFuncionalidad(this.formulario.get('Nombre')?.value)
            .subscribe(resp => {
              if (resp > 0) {
                this.ventanaEmergenteError(this.funcExistente);
              } else {
                this.verTablaPrevisualizar();
              }
            });
          }
        });
      }
    }
  }
  
  guardar(): void{
    if (this.nombre != undefined) {
      if (this.resultado[0].codFunc != this.formulario.get('CodigoTramite')?.value || 
          this.resultado[0].nameFunc != this.formulario.get('Nombre')?.value) {
        this.funcionalidadesService.editarFuncionalidad(
          this.crearFuncionalidad(this.resultado[0].funcionalityId))
        .subscribe(resp => {
          if (resp == 1) {
            this.funcionalidadRolesService.borrarFuncionalidadRoles(this.resultado[0].funcionalityId)
            .subscribe(rta => {
              if (rta > 0) {
                this.list_asignaciones = [];
                this.listaAsignaciones(this.resultado[0].funcionalityId);
                this.funcionalidadRolesService.guardarFuncionalidadRoles(this.list_asignaciones)
                .subscribe(answ => {
                  if (answ > 0) {
                    this.ventanaEmergenteExito();
                  } else {
                    this.ventanaEmergenteError(this.errorGuardado);
                  }
                });
              } else {
                this.ventanaEmergenteError(this.errorGuardado);
              }
            });
          } else {
            this.ventanaEmergenteError(this.errorGuardado);
          }
        });
      } else {
        this.funcionalidadRolesService.borrarFuncionalidadRoles(this.resultado[0].funcionalityId)
        .subscribe(rta => {
          if (rta > 0) {
            this.list_asignaciones = [];
            this.listaAsignaciones(this.resultado[0].funcionalityId);
            this.funcionalidadRolesService.guardarFuncionalidadRoles(this.list_asignaciones)
            .subscribe(answ => {
              if (answ > 0) {
                this.ventanaEmergenteExito();
              } else {
                this.ventanaEmergenteError(this.errorGuardado);
              }
            });
          } else {
            this.ventanaEmergenteError(this.errorGuardado);
          }
        });
      }
    } else {
      this.funcionalidadesService.crearFuncionalidad(this.crearFuncionalidad(0))
      .subscribe(resp => {
        if (resp > 1) {
          this.list_asignaciones = [];
          this.listaAsignaciones(resp);
          this.funcionalidadRolesService.guardarFuncionalidadRoles(this.list_asignaciones)
          .subscribe(resp => {
            if (resp > 0) {
              this.ventanaEmergenteExito();
            } else {
              this.ventanaEmergenteError(this.errorGuardado);
            }
          });
          // this.router.navigateByUrl('principal');
        } else {
          this.ventanaEmergenteError(this.errorGuardado);
        }
      });
    }
  }

  traerFechaString(i: number): string{
    this.fecha = new Date();

    let mes = (this.fecha.getMonth() + 1) < 10 ? '0' + (this.fecha.getMonth() + 1).toString() : (this.fecha.getMonth() + 1).toString();
    let dia = (this.fecha.getDate()) < 10 ? '0' + (this.fecha.getDate()).toString() : (this.fecha.getDate()).toString();
    let hora = (this.fecha.getHours()) < 10 ? '0' + (this.fecha.getHours()).toString() : (this.fecha.getHours()).toString();
    let min = (this.fecha.getMinutes()) < 10 ? '0' + (this.fecha.getMinutes()).toString() : (this.fecha.getMinutes()).toString();
    let seg = (this.fecha.getSeconds() + i) < 10 ? '0' + (this.fecha.getSeconds() + i).toString() : (this.fecha.getSeconds() + i).toString();

    this.formato = this.fecha.getFullYear().toString() + '-' + mes + '-' + dia + ' ' + hora + ':' +
                   min + ':' + seg + '.' + this.fecha.getMilliseconds().toString();

    return this.formato;
  }

  listaAsignaciones(id: number): void{
    for (let index = 0; index < this.list_roles_destino.length; index++) {
      this.guardarAsignaciones = {
        funcionality_RolId: this.traerFechaString(index),
        funcionalityId: id,
        rolId: this.list_roles_destino[index].rolId,
        estado: true
      }
      
      this.list_asignaciones.push(this.guardarAsignaciones);
    }
  }

  crearFuncionalidad(id: number): Funcionalidades{
    return this.funcionalidad = {
      funcionalityId: id,
      codTramite: this.formulario.get('CodigoTramite')?.value,
      nameFunc: this.formulario.get('Nombre')?.value,
      codigo: this.nombre != undefined ? this.resultado[0].codigo : '0',
      estado: true
    }
  }

  ventanaEmergenteError(mensaje: string): void{
    Swal.fire({
      title: 'Operación no exitosa',
      text: `${ mensaje }`,
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
}
