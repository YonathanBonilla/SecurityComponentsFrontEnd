import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcionalidades } from '../models/funcionalidades.model';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadesService {

  constructor(private http: HttpClient) 
  { }

  traerFuncionalidades(): Observable<Funcionalidades[]>{
    return this.http.get<Funcionalidades[]>(`${ URL }/funcionality/list`);
  }

  traerFuncionalidad(nombre: string): Observable<Funcionalidades[]>{
    return this.http.get<Funcionalidades[]>(`${ URL }/funcionality/${ nombre }`);
  }

  crearFuncionalidad(objeto: Funcionalidades): Observable<number>{
    return this.http.post<number>(`${ URL }/funcionality/insert`, objeto);
  }
  
  desactivarFuncionalidad(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/funcionality/off/${ id }`);
  }

  activarFuncionalidad(id: number): Observable<number>{
    return this.http.delete<number>(`${ URL }/funcionality/on/${ id }`);
  }

  editarFuncionalidad(objeto: Funcionalidades): Observable<number>{
    return this.http.put<number>(`${ URL }/funcionality/update`, objeto);
  }

  revisarNombreFuncionalidad(nombre: string): Observable<number>{
    return this.http.get<number>(`${ URL }/funcionality/search/name/${ nombre }`);
  }

  revisarCodigoFuncionalidad(codigo: string): Observable<number>{
    return this.http.get<number>(`${ URL }/funcionality/search/code/${ codigo }`);
  }
}