import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  rol: string | null = null;

  ngOnInit() {
    //Vemos quien esta  logueado (usuario o ong)
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      this.rol = localStorage.getItem('rol'); 
    }
  }
}
