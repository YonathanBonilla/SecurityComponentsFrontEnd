import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuarioRoles } from '../../../models/usuarioRoles.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { UsuarioRolesService } from '../../../services/usuario-roles.service';
import { Funcionalidades } from '../../../models/funcionalidades.model';

@Component({
  selector: 'app-cons-func-roles-usu',
  templateUrl: './cons-func-roles-usu.component.html',
  styleUrls: ['./cons-func-roles-usu.component.css']
})
export class ConsFuncRolesUsuComponent implements OnInit {

  titulo = 'Consulta de funcionalidades y roles que posee un usuario';
  subtitulo1 = 'Funcionalidades en los que tiene permisos y roles';
  subtitulo2 = 'Roles autorizados para esta funcionalidad';
  usuarios: Usuarios[] = [];
  list_rol_s: string[] = [];
  list_func_ob: Funcionalidades[] = [];
  list_usu_rols: UsuarioRoles[] = [];
  indice: number | undefined;
  id: number | undefined;
  
  constructor(private usuariosService: UsuariosService,
              private usuarioRolesService: UsuarioRolesService,
              private route: ActivatedRoute,
              private router: Router) { 
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.id = parseInt(this.route.snapshot.paramMap.get('id')!);
    }
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    if (this.id != undefined) {
      this.cargarUsuariosRoles();
    }
  }

  cargarUsuarios(): void{
    this.usuariosService.traerUsuarios()
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }

  regresar(): void{
    this.router.navigateByUrl('usuarios');
  }

  cargarUsuariosRoles(): void{
    this.usuarioRolesService.traerUsuarioRoles(this.id!, 1)
    .subscribe(resp => {
      this.list_usu_rols = resp;
      this.cargarFuncionalidadesObj();
    });
  }

  cargarFuncionalidadesObj(): void{
    let cont = 0;
    this.list_func_ob = [];
    this.list_usu_rols.forEach(resp => {
      this.list_func_ob.forEach(ver => {
        if (ver.funcionalityId === resp.funcionality?.funcionalityId) {
          cont++;
        }
      });
      if (cont == 0) {
        this.list_func_ob.push(resp.funcionality!);
      }
      cont = 0;
    });
  }

  cargarRoles(id: number): void{
    this.indice = id;
    this.list_rol_s = [];
    this.list_usu_rols.forEach(resp => {
      if (resp.funcionalityId === id) {
        this.list_rol_s.push(resp.roles?.rolName!.trim()!);
      }
    });
  }

  seleccionUsuario(e: any): void{
    this.indice = 0;
    this.list_usu_rols = [];
    this.list_rol_s = [];
    this.usuarioRolesService.traerUsuarioRoles(e.target.value, 1)
    .subscribe(resp => {
      this.list_usu_rols = resp;
      this.cargarFuncionalidadesObj();
    });
  }
}
