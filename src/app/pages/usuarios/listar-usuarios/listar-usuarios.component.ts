import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {

  titulo = 'Consulta de usuarios';
  usuarios: Usuarios[] = [];
  pagina = 1;
  
  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    $("#cancel").on("click", function() {
      $("#caja").val('');
    });
  }

  cargarUsuarios(): void{
    this.usuariosService.traerUsuarios()
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }

  borrar(): void{
    this.cargarUsuarios();
  }
  
  buscar(texto: string): void{
    this.usuariosService.traerUsuario(texto)
    .subscribe(resp => {
      this.usuarios = resp;
    });
  }
}
