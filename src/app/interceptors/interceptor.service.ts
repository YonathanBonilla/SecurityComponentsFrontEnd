import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(this.manejarError)
    );
  }

  manejarError(error:HttpErrorResponse){
    if (error.status == 401) {
      Swal.fire({
        text: 'Usuario y/o contraseña no validos',
        iconHtml: '<img src="assets/img/error.png" class="w-75 ms-3">',
        customClass: {
          icon: 'no-bordes',
          htmlContainer: 'text-danger fw-bold'
        },
        allowOutsideClick: false,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
      });
    }

    if (error.status == 400) {
      Swal.fire({
        text: 'El usuario no es un correo valido',
        iconHtml: '<img src="assets/img/error.png" class="w-75 ms-3">',
        customClass: {
          icon: 'no-bordes',
          htmlContainer: 'text-danger fw-bold'
        },
        allowOutsideClick: false,
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
      });
    }
    
    console.warn(error);
    return throwError(() => new Error('test'))
  }
}
