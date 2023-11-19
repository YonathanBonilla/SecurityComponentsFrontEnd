import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roles } from '../models/roles.model';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) 
  { }

  traerRoles(): Observable<Roles[]>{
    return this.http.get<Roles[]>(`${ URL }/rol/list`);
  }

  traerRol(nombre: string): Observable<Roles[]>{
    return this.http.get<Roles[]>(`${ URL }/rol/${ nombre }`);
  }

  desactivarRol(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/rol/off/${ id }`);
  }

  activarRol(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/rol/on/${ id }`);
  }

  actualizarRol(rol: Roles): Observable<number>{
    return this.http.put<number>(`${ URL }/rol/update`, rol);
  }

  crearRol(rol: Roles): Observable<number>{
    return this.http.post<number>(`${ URL }/rol/insert`, rol);
  }

  revisarRol(nombre: string): Observable<number>{
    return this.http.get<number>(`${ URL }/rol/search/${ nombre }`);
  }
}