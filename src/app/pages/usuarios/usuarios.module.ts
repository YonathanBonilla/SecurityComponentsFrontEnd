import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { ComponentsModule } from '../../components/components.module';
import { ConsFuncRolesUsuComponent } from './cons-func-roles-usu/cons-func-roles-usu.component';
import { AsigFuncRolUsuComponent } from './asig-func-rol-usu/asig-func-rol-usu.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    ListarUsuariosComponent,
    ConsFuncRolesUsuComponent,
    AsigFuncRolUsuComponent,
    CrearUsuarioComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
