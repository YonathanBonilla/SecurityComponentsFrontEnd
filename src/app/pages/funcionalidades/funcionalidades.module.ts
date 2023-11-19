import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../components/components.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FuncionalidadesRoutingModule } from './funcionalidades-routing.module';
import { FuncionalidadesComponent } from './funcionalidades.component';
import { ListarFuncComponent } from './listar-func/listar-func.component';
import { CrearFuncComponent } from './crear-editar-func/crear-editar-func.component';


@NgModule({
  declarations: [
    FuncionalidadesComponent,
    ListarFuncComponent,
    CrearFuncComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    FuncionalidadesRoutingModule
  ]
})
export class FuncionalidadesModule { }
