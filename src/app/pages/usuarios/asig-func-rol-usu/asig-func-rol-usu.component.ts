import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { FuncionalidadesService } from '../../../services/funcionalidades.service';
import { UsuarioRolesService } from '../../../services/usuario-roles.service';
import { FuncionalidadRolesService } from '../../../services/funcionalidad-roles.service';
import { Usuarios } from '../../../models/usuarios.model';
import { Funcionalidades } from '../../../models/funcionalidades.model';
import { UsuarioRoles } from '../../../models/usuarioRoles.model';
import { UsuarioRolesLast } from '../../../models/usuarioRolesLast.model';
import { FuncionalidadRolesFull } from '../../../models/funcionalidadRolesFull.model';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-asig-func-rol-usu',
  templateUrl: './asig-func-rol-usu.component.html',
  styleUrls: ['./asig-func-rol-usu.component.css']
})
export class AsigFuncRolUsuComponent implements OnInit {

  titulo = 'Asignación de funcionalidades y roles a usuarios';
  informacionIncompleta = 'La acción solicitada no se pudo completar, se debe seleccionar al menos un usuario, ' +
                          'funcionalidad y rol';
  confirmacionAccion = 'Los roles y funcionalidades seleccionadas serán asignados a los usuarios seleccionados';
  errorAsignacion = 'Las asignaciones seleccionadas no pudieron realizarse';
  errorModificacion = 'La acción solicitada no se pudo completar';
  indiceFuncOrigen: any;
  indiceFuncDestino: any;
  indiceRolOrigen: any;
  indiceRolDestino: any;
  modelo = 0;
  m_usu = 0;
  m_func = 0;
  m_rol = 0;
  numero = null;
  funcionalidadOri: Funcionalidades | undefined;
  funcionalidadDest: Funcionalidades | undefined;
  rolOrigen: FuncionalidadRolesFull | undefined;
  rolDestino: FuncionalidadRolesFull | undefined;
  objeto: FuncionalidadRolesFull | undefined;
  usuarioRoles: UsuarioRoles | undefined;
  usuarios: Usuarios[] = [];
  roles: FuncionalidadRolesFull[] = [];
  funcionalidades: Funcionalidades[] = [];
  ult_asig: UsuarioRolesLast[] = [];
  list_usu_n: number[] = [];
  list_usu_s: string[] = [];
  list_func: Funcionalidades[] = [];
  list_temp: Funcionalidades[] = [];
  list_roles: FuncionalidadRolesFull[] = [];
  list_roles_temp: FuncionalidadRolesFull[] = [];
  list_roles_asig: FuncionalidadRolesFull[] = [];
  list_roles_temp_n: number[] = [];
  list_usu_roles: UsuarioRoles[] = [];
  cadena: string[] = [];
  cadena_temp: string[] = [];
  rol_func_final: FuncionalidadRolesFull[] = [];
  estado = false;
  
  constructor(private usuariosService: UsuariosService,
              private funcionalidadesService: FuncionalidadesService,
              private usuarioRolesService: UsuarioRolesService,
              private funcionalidadRolesService: FuncionalidadRolesService,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarFuncionalidades();
    this.ultimasAsignaciones();

    $("#cancelFunc").on("click", () => {
      $("#cajaFunc").val('');
      this.indiceFuncOrigen = null;
      this.funcionalidadOri = undefined;
    });

    $("#cancelRol").on("click", () => {
      $("#cajaRol").val('');
      this.indiceRolOrigen = null;
      this.rolOrigen = undefined;
    });
  }

  cargarUsuarios(): void{
    this.usuariosService.traerUsuarios()
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }

  cargarFuncionalidades(): void{
    this.funcionalidadesService.traerFuncionalidades()
    .subscribe(resp => {
      this.funcionalidades = resp;
    });
  }

  ultimasAsignaciones(): void{
    this.usuarioRolesService.traerUltimasAsignaciones()
    .subscribe(resp => {
      this.ult_asig = resp;
    });
  }

  usuario_seleccion(e: any): void{
    if (!this.list_usu_n.includes(parseInt(e.target.value))) {
      this.list_usu_n.push(parseInt(e.target.value));
      this.list_usu_s.push(e.target[e.target.selectedIndex].text);
    }
  }

  quitar_usuario(item: number): void{
    this.list_usu_s.splice(item, 1);
    this.list_usu_n.splice(item, 1);
  }
  
  seleccionFuncOrigen(e: any): void{
    this.indiceFuncOrigen = e.target.value;
    this.funcionalidadOri = this.funcionalidades.find(x => x.funcionalityId == e.target.value);
  }

  seleccionFuncDestino(e: any): void{
    this.indiceFuncDestino = e.target.value;
    this.funcionalidadDest = this.funcionalidades.find(x => x.funcionalityId == e.target.value);
    this.funcionalidadRolesService.consultarFuncionalidadRoles(this.funcionalidadDest?.nameFunc!)
    .subscribe(resp => {
      this.roles = resp;
    });
  }

  seleccionRolOrigen(e: any): void{
    this.indiceRolOrigen = e.target.value;
    this.rolOrigen = this.roles.find(x => x.rolId == e.target.value);
  }

  seleccionRolDestino(e: any): void{
    this.indiceRolDestino = e.target.value;
    this.rolDestino = this.list_roles.find(x => x.rolId == e.target.value);
  }

  agregarFunc(): void{
    if (this.funcionalidadOri != undefined) {
      if (!this.list_func.includes(this.funcionalidadOri)) {
        this.list_func.push(this.funcionalidadOri!);
      }
      this.funcionalidadRolesService.consultarFuncionalidadRoles(this.funcionalidadOri.nameFunc!)
      .subscribe(resp => {
        this.roles = resp;
      });

      this.indiceFuncOrigen = 0;
      this.funcionalidadOri = undefined;
    }
  }

  quitarFunc(): void{
    if (this.funcionalidadDest != undefined) {
      this.list_roles_temp = [];
      this.list_roles_temp_n = [];
      this.cadena = [];
      this.list_func = this.list_func.filter(x => x.funcionalityId != this.funcionalidadDest?.funcionalityId);
      this.rol_func_final = this.rol_func_final.filter(x => x.funcionalityId != this.funcionalidadDest?.funcionalityId);
      this.rol_func_final.forEach(fin => {
        this.list_roles.forEach(rol => {
          if (fin.rolId == rol.rolId && !this.list_roles_temp_n.includes(fin.rolId!)) {
            this.list_roles_temp_n.push(fin.rolId!);
          }
        });
      });
      this.list_roles_temp_n.forEach(item => {
        this.objeto = this.list_roles.find(x => x.rolId == item);
        this.list_roles_temp.push(this.objeto!);
      });

      this.list_roles = this.list_roles_temp;
      this.list_roles.forEach(item => {
        this.cadena.push(item.rolName!);
      });
      this.indiceFuncDestino = 0;
      this.funcionalidadDest = undefined;
      this.roles = [];
    }
  }

  agregarRol(): void{
    if (this.rolOrigen != undefined) {
      if (!this.cadena.includes(this.rolOrigen.rolName!)) {
        this.list_roles.push(this.rolOrigen!);
        this.cadena.push(this.rolOrigen.rolName!);
        this.rol_func_final.push(this.rolOrigen);
      } else {
        this.rol_func_final.forEach(item => {
          if (this.rolOrigen?.codFunc == item.codFunc) {
            this.estado = true;
          }
        });

        if (!this.estado) {
          this.rol_func_final.push(this.rolOrigen!);
        }
      }

      this.estado = false;
      this.indiceRolOrigen = 0;
      this.rolOrigen = undefined;
    }
  }

  quitarRol(): void{
    if (this.rolDestino != undefined) {
      this.list_temp = [];
      this.list_roles = this.list_roles.filter(x => x.rolId != this.rolDestino?.rolId);
      this.rol_func_final = this.rol_func_final.filter(x => x.rolId != this.rolDestino?.rolId);
      this.cadena = this.cadena.filter(x => x != this.rolDestino?.rolName);
      this.list_func.forEach(fun => {
        this.rol_func_final.forEach(fin => {
          if (fun.funcionalityId == fin.funcionalityId && !this.list_temp.includes(fun)) {
            this.list_temp.push(fun);
          }
        });
      });
      this.list_func = this.list_temp;
      this.indiceRolDestino = 0;
      this.rolDestino = undefined;
      this.roles = [];
    }
  }

  buscarFunc(texto: string): void{
    this.funcionalidadesService.traerFuncionalidad(texto)
    .subscribe(resp => {
      this.funcionalidades = resp;
    });
  }

  borrarFunc(): void{
    this.cargarFuncionalidades();
  }

  buscarRol(texto: string): void{
    this.roles = this.roles.filter(x => x.rolName == texto);
  }

  borrarRol(): void{
    this.roles = [];
  }
  
  cancelar(): void{
    this.list_func = [];
    this.list_roles = [];
    this.roles = [];
    this.rol_func_final = [];
    this.list_usu_n = [];
    this.list_usu_s = [];
    this.modelo = 0;
    this.indiceFuncOrigen = 0;
    this.indiceRolOrigen = 0;
  }

  mostrarBotones(num: any, usuId: number, funcId: any, rolId: any, nomFunc: string): void{
    this.funcionalidadRolesService.consultarFuncionalidadRoles(nomFunc)
    .subscribe(resp => {
      this.list_roles_asig = resp;
    });
    this.numero = num;
    this.m_usu = usuId;
    this.m_func = funcId;
    this.m_rol = rolId;
  }

  botonCancelar(): void{
    this.numero = null;
    this.ultimasAsignaciones();
  }

  modificarFunc(num: any, e: any): void{
    this.ult_asig[num].funcionalityId = parseInt(e.target.value);
    this.ult_asig[num].nameFunc = e.target[e.target.selectedIndex].text;
    this.funcionalidadRolesService.consultarFuncionalidadRoles(e.target[e.target.selectedIndex].text)
    .subscribe(resp => {
      this.list_roles_asig = resp;
    });
    this.ult_asig[num].rolId = undefined;
  }

  modificarRol(num: any, e: any): void{
    this.ult_asig[num].rolId = parseInt(e.target.value);
    this.ult_asig[num].rolName = e.target[e.target.selectedIndex].text;
  }

  modificarUsu(num: any, e: any): void{
    this.ult_asig[num].userId = parseInt(e.target.value);
    this.ult_asig[num].userName = e.target[e.target.selectedIndex].text;
  }

  guardar(): void{
    if (this.list_usu_n.length == 0 || this.rol_func_final.length == 0) {
      this.ventanaEmergenteError(this.informacionIncompleta);
    } else {
      this.ventanaEmergenteWarning(this.confirmacionAccion)
      .then(resp => {
        if (resp.value) {
          this.rol_func_final.forEach(item => {
            this.list_usu_n.forEach(usu => {
              this.usuarioRoles = {
                user_RolId: 0,
                userId: usu,
                rolId: item.rolId,
                funcionalityId: item.funcionalityId,
                roles: undefined,
                funcionality: undefined
              }
              this.list_usu_roles.push(this.usuarioRoles);
            });
          });
      
          this.usuarioRolesService.guardarUsuarioRoles(this.list_usu_roles)
          .subscribe(resp => {
            if (resp > 0) {
              this.ventanaEmergenteExito();
              this.cancelar();
              this.ultimasAsignaciones();
            } else {
              this.ventanaEmergenteError(this.errorAsignacion);
            }
          });
        }
      });
    }
  }

  modificarAsignaciones(num: any): void{
    if (this.ult_asig[num].rolId == undefined) {
      this.ventanaEmergenteError('Debe escoger un rol');
    } else {
      this.usuarioRoles = {
        user_RolId: this.ult_asig[num].userRolId,
        userId: this.ult_asig[num].userId,
        rolId: this.ult_asig[num].rolId,
        funcionalityId: this.ult_asig[num].funcionalityId,
        roles: undefined,
        funcionality: undefined
      }
  
      this.usuarioRolesService.actualizarUsuarioRoles(this.usuarioRoles)
      .subscribe(resp => {
        if (resp == 1) {
          this.ventanaEmergenteExito();
          this.numero = null;
          this.ultimasAsignaciones();
        } else {
          this.ventanaEmergenteError(this.errorModificacion);
          this.numero = null;
          this.ultimasAsignaciones();
        }
      });
    }
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
}
