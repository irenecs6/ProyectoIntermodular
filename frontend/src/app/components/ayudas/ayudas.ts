import { Component, OnInit, ChangeDetectorRef ,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ayudas',
  imports: [CommonModule, RouterModule],
  templateUrl: './ayudas.html',
  styleUrl: './ayudas.css',
})
export class Ayudas {
  listaAyudas: any[] = [];
  cargando: boolean = true;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.obtenerTodasLasAyudas().subscribe({
      next: (datos) => {
        this.listaAyudas = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las ayudas:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  intentarDonar(ayudaId: number) {
    //Comprobamos si hay alguien logueado
    if (!this.authService.estaLogueado()) {
      Swal.fire({
        title: '¡Espera un momento!',
        text: 'Para realizar una donación necesitas iniciar sesión.',
        icon: 'info',
        confirmButtonText: 'Ir al Login',
        confirmButtonColor: '#1a365d',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#6e7881'
      }).then((result) => {
        if (result.isConfirmed) {
            this.router.navigate(['/login']);
        }
      });
      return;
    }

    const rol = this.authService.obtenerRolActual();

    //si es donante
    if (rol === 'donante') {
      this.router.navigate(['/donar', ayudaId]);
    } else if (rol === 'ong') {
      //Si es una ONG
      Swal.fire({
        title: 'Acción no permitida',
        text: 'Como ONG, tu perfil está habilitado para gestionar ayudas, no para realizar donaciones.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1a365d'
      });
      return;
    } else {
      Swal.fire({
        title: 'Error de perfil',
        text: 'No hemos podido verificar tu tipo de cuenta. Por favor, cierra sesión y vuelve a entrar.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1a365d'
      });
      return;
    }
  }
}