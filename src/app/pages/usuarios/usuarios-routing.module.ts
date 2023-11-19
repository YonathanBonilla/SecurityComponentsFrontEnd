import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { ConsFuncRolesUsuComponent } from './cons-func-roles-usu/cons-func-roles-usu.component';
import { AsigFuncRolUsuComponent } from './asig-func-rol-usu/asig-func-rol-usu.component';
import { SeguridadGuard } from '../../guards/seguridad.guard';

const routes: Routes = [
  {
    path: 'usuarios', component: UsuariosComponent, canActivate: [SeguridadGuard], canActivateChild: [SeguridadGuard],
    children: [
      {path: '', component: ListarUsuariosComponent},
      {path: 'cons-func-rol-usu/:id', component: ConsFuncRolesUsuComponent},
      {path: 'cons-func-rol-usu', component: ConsFuncRolesUsuComponent},
      {path: 'asig-func-rol-usu', component: AsigFuncRolUsuComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
