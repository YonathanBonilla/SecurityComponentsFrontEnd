import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadGuard implements CanActivate, CanActivateChild {

  constructor(private loginService: LoginService) {}

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.validarTiempo();
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.validarTiempo();
  }
  
}
