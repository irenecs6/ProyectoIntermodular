import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
constructor(private router: Router) {}

  //comprobamos si alhun usuario o ong esta conectado
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  //Comprobamos si es usuario o ong
  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  //desechamos el token y volvemos al inicio
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
