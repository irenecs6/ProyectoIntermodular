import { Component, OnInit, ChangeDetectorRef ,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ayudas',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ayudas.html',
  styleUrl: './ayudas.css',
})
export class Ayudas {
  listaAyudas: any[] = [];
  cargando: boolean = true;
  
  ayudasFiltradas: any[] = [];
  filtroNombre: string = '';
  filtroEstado: string = '';
  filtroEstadoONG: string = '';


  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.obtenerTodasLasAyudas().subscribe({
      next: (datos) => {
        this.listaAyudas = datos;
        this.ayudasFiltradas = datos;
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

  aplicarFiltros() {
    this.ayudasFiltradas = this.listaAyudas.filter(ayuda => {
      //comprobamos si el nombre coincide con alguna ayuda
      const coincideNombre = ayuda.nombreayuda.toLowerCase().includes(this.filtroNombre.toLowerCase());
      //Comprobamos si el estado de las ayudas coincide
      const coincideEstado = this.filtroEstado === '' || ayuda.estado === this.filtroEstado;
      //Comprobamos si el estado ONG coincide
      const coincideEstadoONG = this.filtroEstadoONG === '' || ayuda.ong_estado === this.filtroEstadoONG;
      
      return coincideNombre && coincideEstado && coincideEstadoONG;
    });
    this.cdr.detectChanges();
  }
}