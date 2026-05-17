import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-incidencia',
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-incidencia.html',
  styleUrl: './ver-incidencia.css',
})
export class VerIncidencia implements OnInit{
  
  idAyuda: string | null = '';
  cargando: boolean = true;
  ayuda: any = null;

  private cdr = inject(ChangeDetectorRef);

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService) {}

  ngOnInit() {
    //buscaqmos y guardamo el id
    this.idAyuda = this.route.snapshot.paramMap.get('id');
    console.log('ID de ruta de la ayuda:', this.idAyuda);
  
    if (this.idAyuda) {
      this.cargarDetalles(this.idAyuda);
    }
  
  }

  cargarDetalles(id: string) {
    this.authService.obtenerAyudaPorId(id).subscribe({
      next: (datos) => {
        this.ayuda = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los detalles:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  intentarDonar(ayudaId: number) {
    //si no estamos logeado
    if (!this.authService.estaLogueado()) {
      Swal.fire({
        title: '¡Espera un momento!',
        text: 'Para realizar una donación necesitas iniciar sesión.',
        icon: 'info',
        confirmButtonText: 'Ir al Login',
        confirmButtonColor: '#1a365d',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    const rol = this.authService.obtenerRolActual();
    //comprobamos que es donante
    if (rol === 'donante') {
      this.router.navigate(['/donar', ayudaId]);
    } else {
      Swal.fire({
        title: 'Acción no permitida',
        text: 'Solo los perfiles de donantes pueden realizar esta acción.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  }

  
}