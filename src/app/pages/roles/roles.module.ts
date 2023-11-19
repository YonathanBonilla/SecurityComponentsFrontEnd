import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { ListarRolesComponent } from './listar-roles/listar-roles.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AsigRolUsuComponent } from './asig-rol-usu/asig-rol-usu.component';

@NgModule({
  declarations: [
    RolesComponent,
    ListarRolesComponent,
    AsigRolUsuComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    NgxPaginationModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
