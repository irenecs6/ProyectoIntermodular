import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ayudas-ong',
  imports: [CommonModule, RouterLink],
  templateUrl: './ayudas-ong.html',
  styleUrl: './ayudas-ong.css',
})
export class AyudasONG {
  
  misAyudas: any[] = [];
  cifOng: string = '';
  cargando: boolean = true;

  private cdr = inject(ChangeDetectorRef);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargando = true;
    // Comprobamos si estamos en el navegador
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      //buscamos en cif
      this.cifOng = localStorage.getItem('id') || '';
    }
    //si lo encontramos cargamos las ayudas
    if (this.cifOng) {
      this.cargarMisCampanas();
      this.cdr.detectChanges();

    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarMisCampanas() {
    this.authService.obtenerAyudas().subscribe({
      next: (todasLasAyudas) => {
        //Filtramos por cif para que solo salga sus ayudas
        this.misAyudas = todasLasAyudas.filter((ayuda: any) => String(ayuda.ong) === String(this.cifOng));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar las campañas', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}