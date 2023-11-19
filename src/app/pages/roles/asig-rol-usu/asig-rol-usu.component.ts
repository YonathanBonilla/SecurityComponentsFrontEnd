import { Component, OnInit } from '@angular/core';
import { Funcionalidades } from 'src/app/models/funcionalidades.model';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuarioRoles } from '../../../models/usuarioRoles.model';
import { UsuarioRolesLast } from '../../../models/usuarioRolesLast.model';
import { FuncionalidadRolesFull } from '../../../models/funcionalidadRolesFull.model';
import { FuncionalidadesService } from 'src/app/services/funcionalidades.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuarioRolesService } from '../../../services/usuario-roles.service';
import { FuncionalidadRolesService } from '../../../services/funcionalidad-roles.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-asig-rol-usu',
  templateUrl: './asig-rol-usu.component.html',
  styleUrls: ['./asig-rol-usu.component.css']
})
export class AsigRolUsuComponent implements OnInit {

  titulo = 'Asignación de usuarios a roles en una misma funcionalidad';
  informacionIncompleta = 'Se debe seleccionar al menos un usuario y un rol de alguna funcionalidad';
  confirmacionAccion = 'Los roles y funcionalidades seleccionadas serán asignados a los usuarios seleccionados';
  errorAsignacion = 'Las asignaciones seleccionadas no pudieron realizarse';
  errorModificacion = 'La acción solicitada no se pudo completar';
  modelo1 = 0;
  m_usu = 0;
  m_func = 0;
  m_rol = 0;
  numero = null;
  estado = false;
  cadena: string[] = [];
  list_roles_origen: FuncionalidadRolesFull[] = [];
  list_roles_destino: FuncionalidadRolesFull[] = [];
  list_roles_asig: FuncionalidadRolesFull[] = [];
  indiceRolOrigen: any;
  indiceRolDestino: any;
  rolOrigen: FuncionalidadRolesFull | undefined;
  rolDestino: FuncionalidadRolesFull | undefined;
  rol_func_final: FuncionalidadRolesFull[] = [];
  funcionalidades: Funcionalidades[] = [];
  usuarios: Usuarios[] = [];
  usuariosRoles: UsuarioRoles[] = [];
  ult_asig: UsuarioRolesLast[] = [];
  usuarioRol: UsuarioRoles | undefined;
  list_usu_n: number[] = [];

  constructor(private funcionalidadRolesService: FuncionalidadRolesService,
              private funcionalidadesService: FuncionalidadesService,
              private usuariosService: UsuariosService,
              private usuarioRolesService: UsuarioRolesService)
  { }

  ngOnInit(): void {
    this.cargarFuncionalidades();
    this.cargarUsuarios();
    this.ultimasAsignaciones();

    $("#cancel").on("click", function() {
      $("#caja").val('');
    });
  }

  cargarFuncionalidades(): void{
    this.funcionalidadesService.traerFuncionalidades()
    .subscribe(resp => {
      this.funcionalidades = resp;
    });
  }

  cargarUsuarios(): void{
    this.usuariosService.traerUsuarios()
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }

  ultimasAsignaciones(): void{
    this.usuarioRolesService.traerUltimasAsignaciones()
    .subscribe(resp => {
      this.ult_asig = resp;
    });
  }

  func_seleccion(e: any, x: number): void{
    x == 1 ? this.list_roles_origen = [] : this.list_roles_asig = [];
    this.funcionalidadRolesService.consultarFuncionalidadRoles(e.target[e.target.selectedIndex].text)
    .subscribe(resp => {
      if (x == 1) {
        this.list_roles_origen = resp;
      } else {
        this.list_roles_asig = resp;
      }
    });
  }

  seleccionRolOrigen(e: any): void{
    this.indiceRolOrigen = e.target.value;
    this.rolOrigen = this.list_roles_origen.find(x => x.rolId == e.target.value);
  }

  seleccionRolDestino(e: any): void{
    this.indiceRolDestino = e.target.value;
    this.rolDestino = this.list_roles_destino.find(x => x.rolId == e.target.value);
  }

  agregarRol(): void{
    if (this.rolOrigen != undefined) {
      if (!this.cadena.includes(this.rolOrigen.rolName!)) {
        this.list_roles_destino.push(this.rolOrigen!);
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
      this.list_roles_destino = this.list_roles_destino.filter(x => x.rolId != this.rolDestino?.rolId);
      this.rol_func_final = this.rol_func_final.filter(x => x.rolId != this.rolDestino?.rolId);
      this.cadena = this.cadena.filter(x => x != this.rolDestino?.rolName);
      this.indiceRolDestino = 0;
      this.rolDestino = undefined;
    }
  }
  
  buscar(texto: string): void{
    this.usuariosService.traerUsuario(texto)
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }

  borrar(): void{
    this.cargarUsuarios();
  }
  
  todos(e: any): void{
    this.list_usu_n = [];
    this.usuarios.forEach(x => {
      x.inicio = e.target.checked
      if (e.target.checked) {
        this.list_usu_n.push(x.adUserId!)
      }
    });
  }

  mostrarBotones(num: any, usuId: number, funcId: any, rolId: any, rolFunc: string): void{
    this.funcionalidadRolesService.consultarFuncionalidadRoles(rolFunc)
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

  cancelar(): void{
    this.modelo1 = 0;
    this.list_usu_n = [];
    this.indiceRolOrigen = 0;
    this.indiceRolDestino = 0;
    this.rolOrigen = undefined;
    this.rolDestino = undefined;
    this.cadena = [];
    this.list_roles_origen = [];
    this.list_roles_destino = [];
    this.rol_func_final = [];
    this.cargarUsuarios();
    $("#all").prop("checked", false);
  }
  
  agregarUsuario(e: any): void{
    if (e.target.checked) {
      this.list_usu_n.push(parseInt(e.target.value));
    } else {
      this.list_usu_n = this.list_usu_n.filter(val => val != parseInt(e.target.value));
    }
  }

  modificarFunc(num: any, e: any): void{
    this.ult_asig[num].funcionalityId = parseInt(e.target.value);
    this.ult_asig[num].nameFunc = e.target[e.target.selectedIndex].text;
    this.func_seleccion(e, 2);
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
              this.usuarioRol = {
                user_RolId: 0,
                userId: usu,
                rolId: item.rolId,
                funcionalityId: item.funcionalityId,
                roles: undefined,
                funcionality: undefined
              }
              this.usuariosRoles.push(this.usuarioRol);
            });
          });

          this.usuarioRolesService.guardarUsuarioRoles(this.usuariosRoles)
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
      this.usuarioRol = {
        user_RolId: this.ult_asig[num].userRolId,
        userId: this.ult_asig[num].userId,
        rolId: this.ult_asig[num].rolId,
        funcionalityId: this.ult_asig[num].funcionalityId,
        roles: undefined,
        funcionality: undefined
      }
      
      this.usuarioRolesService.actualizarUsuarioRoles(this.usuarioRol)
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
