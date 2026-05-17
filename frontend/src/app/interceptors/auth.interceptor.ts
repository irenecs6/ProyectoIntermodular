import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;

  //Comprobamos si estamos en el navegador antes de tocar localStorage para evitar errore
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }
//Si hay algun token guardado lo clonamos
  if (token) {
    const solicitudClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(solicitudClonada);
  }

  return next(req);
};