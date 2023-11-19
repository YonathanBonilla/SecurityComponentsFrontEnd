import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarRolesComponent } from 'src/app/pages/roles/listar-roles/listar-roles.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';
import { AsigRolUsuComponent } from './asig-rol-usu/asig-rol-usu.component';
import { SeguridadGuard } from '../../guards/seguridad.guard';

const routes: Routes = [
  {
    path: 'roles', component: RolesComponent, canActivate: [SeguridadGuard], canActivateChild: [SeguridadGuard],
    children: [
      {path: '', component: ListarRolesComponent},
      {path: 'asig-rol-usu', component: AsigRolUsuComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
