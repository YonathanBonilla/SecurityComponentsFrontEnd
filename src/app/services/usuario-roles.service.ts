import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UsuarioRoles } from '../models/usuarioRoles.model';
import { UsuarioRolesLast } from '../models/usuarioRolesLast.model';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolesService {

  constructor(private http: HttpClient) 
  { }

  traerUsuariosRoles(): Observable<UsuarioRoles[]>{
    return this.http.get<UsuarioRoles[]>(`${ URL }/user_rol/list`);
  }

  traerUsuarioRoles(id: number, opcion: number): Observable<UsuarioRoles[]>{
    return this.http.get<UsuarioRoles[]>(`${URL}/user_rol/${id}/${opcion}`);
  }

  guardarUsuarioRoles(info: UsuarioRoles[]): Observable<number>{
    return this.http.post<number>(`${URL}/user_rol/insert`, info);
  }
  
  traerUltimasAsignaciones(): Observable<UsuarioRolesLast[]>{
    return this.http.get<UsuarioRolesLast[]>(`${URL}/user_rol/last-assing`);
  }

  actualizarUsuarioRoles(info: UsuarioRoles): Observable<number>{
    return this.http.put<number>(`${URL}/user_rol/update`, info);
  }
}