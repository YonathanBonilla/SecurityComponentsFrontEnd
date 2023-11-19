import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/usuarios.model';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) 
  { }

  traerUsuarios(): Observable<Usuarios[]>{
    return this.http.get<Usuarios[]>(`${ URL }/user/list`);
  }

  traerUsuario(nombre: string): Observable<Usuarios[]>{
    return this.http.get<Usuarios[]>(`${ URL }/user/${ nombre }`);
  }

  guardarUsuario(usuario: Usuarios): Observable<number>{
    return this.http.post<number>(`${ URL }/user/insert`, usuario);
  }
}
