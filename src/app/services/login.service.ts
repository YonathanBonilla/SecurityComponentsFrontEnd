import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginReq } from '../models/loginreq.model';
import { RefreshToken } from '../models/refreshToken.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  objeto!: RefreshToken;
  fecha!: Date;
  resultado!: string;

  constructor(private http: HttpClient,
              private router: Router) 
  {}

  login(info: LoginReq): Observable<any>{
    return this.http.post<any>(`${ URL }/auth/login`, info);
  }

  logout(info: RefreshToken): Observable<any>{
    return this.http.post<any>(`${ URL }/auth/logout`, info);
  }

  validarTiempo(): Promise<boolean>{
    if (localStorage.getItem('exp') != null) {
      let sesion = localStorage.getItem('exp');
      let actual = new Date();
      const tiks = require('ticks-to-date');
      const expiracion = tiks((parseInt(sesion!) * 10000000) + 621355968000000000);
      let tiempoExp = new Date(expiracion.getUTCFullYear(), expiracion.getUTCMonth(), expiracion.getUTCDate(), 
                               expiracion.getUTCHours(), expiracion.getUTCMinutes(), expiracion.getUTCSeconds(),
                               expiracion.getUTCMilliseconds())
    
      let tiempoAct = new Date(actual.getUTCFullYear(), actual.getUTCMonth(), actual.getUTCDate(),
                               actual.getUTCHours(), actual.getUTCMinutes(), actual.getUTCSeconds(),
                               actual.getUTCMilliseconds())
      
      if (tiempoExp > tiempoAct) {
        return Promise.resolve(true);
      } else {
        this.objeto = {
          tokenValue: localStorage.getItem('refreshToken'),
          userId: localStorage.getItem('userId'),
          dateIssued: this.traerFechaString(1),
          dateExpired: this.traerFechaString(1)
        }

        this.logout(this.objeto).subscribe();
        localStorage.clear();
        this.router.navigateByUrl('/login');
        return Promise.resolve(false);
      }
    } else {
      localStorage.clear();
      this.router.navigateByUrl('/login');
      return Promise.resolve(false);
    }
  }

  traerFechaString(i: number): string{
    this.fecha = new Date();

    let mes = (this.fecha.getMonth() + 1) < 10 ? '0' + (this.fecha.getMonth() + 1).toString() : (this.fecha.getMonth() + 1).toString();
    let dia = (this.fecha.getDate()) < 10 ? '0' + (this.fecha.getDate()).toString() : (this.fecha.getDate()).toString();
    let hora = (this.fecha.getHours()) < 10 ? '0' + (this.fecha.getHours()).toString() : (this.fecha.getHours()).toString();
    let min = (this.fecha.getMinutes()) < 10 ? '0' + (this.fecha.getMinutes()).toString() : (this.fecha.getMinutes()).toString();
    let seg = (this.fecha.getSeconds() + i) < 10 ? '0' + (this.fecha.getSeconds() + i).toString() : (this.fecha.getSeconds() + i).toString();

    this.resultado = this.fecha.getFullYear().toString() + '-' + mes + '-' + dia + 'T' + hora + ':' +
                   min + ':' + seg + '.' + this.fecha.getMilliseconds().toString() + 'Z';

    return this.resultado;
  }
}
