import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  constructor(private router: Router) {}

  //comprobamos si estamos logueados
  isLoggedIn(): boolean {
    // Verificamos si estamos en el navegador para que no explote el servidor (SSR)
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      // leemos el token
      return localStorage.getItem('token') !== null;
    }
    // si da error o es el servidor decimos que no esta logueado
    return false; 
  }
  //comprobamos si es donante o ong
  getRol(): string | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return localStorage.getItem('rol');
    }
    return null;
  }

  cerrarSesion() {
    //borramos todo
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('userId');
    }
    // le mandamos al login
    this.router.navigate(['/login']);
  }
}