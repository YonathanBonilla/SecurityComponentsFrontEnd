import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionalidadesComponent } from './funcionalidades.component';
import { ListarFuncComponent } from './listar-func/listar-func.component';
import { CrearFuncComponent } from './crear-editar-func/crear-editar-func.component';
import { SeguridadGuard } from '../../guards/seguridad.guard';

const routes: Routes = [
  {
    path: 'funcionalidades', component: FuncionalidadesComponent, canActivate: [SeguridadGuard], canActivateChild: [SeguridadGuard],
    children: [
      {path: '', component: ListarFuncComponent},
      {path: 'crear-funcionalidad', component: CrearFuncComponent},
      {path: 'crear-funcionalidad/:nombre', component: CrearFuncComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionalidadesRoutingModule { }
