import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FuncionalidadRolesFull } from '../models/funcionalidadRolesFull.model';
import { FuncionalidadRoles } from '../models/funcionalidadRoles.model';
import { Observable } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadRolesService {

  constructor(private http: HttpClient) { }

  traerFuncionalidadRoles(): Observable<any[]>{
    return this.http.get<any[]>(`${ URL }/funcionality_rol/list/full`)
  }

  consultarFuncionalidadRoles(nombre: string): Observable<FuncionalidadRolesFull[]>{
    return this.http.get<FuncionalidadRolesFull[]>(`${ URL }/funcionality_rol/list/full/${ nombre }`);
  }

  desactivarFuncionalidadRoles(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/funcionality_rol/off/${ id }`);
  }

  activarFuncionalidadRoles(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/funcionality_rol/on/${ id }`);
  }

  guardarFuncionalidadRoles(objeto: FuncionalidadRoles[]): Observable<number>{
    return this.http.post<number>(`${ URL }/funcionality_rol/insert`, objeto);
  }

  borrarFuncionalidadRoles(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/funcionality_rol/delete/${ id }`);
  }
}
