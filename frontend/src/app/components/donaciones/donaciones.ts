import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-donaciones',
  imports: [CommonModule, RouterModule],
  templateUrl: './donaciones.html',
  styleUrl: './donaciones.css',
})
export class Donaciones implements OnInit {
  donaciones: any[] = [];
  cargando: boolean = true;
  
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const dni = localStorage.getItem('id');
    
    if (dni) {
      this.authService.obtenerMisDonaciones(dni).subscribe({
        next: (data) => {
          this.donaciones = data;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar donaciones', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}