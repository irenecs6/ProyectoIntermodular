import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacionayudas',
  imports: [FormsModule],
  templateUrl: './creacionayudas.html',
  styleUrl: './creacionayudas.css',
})
export class Creacionayudas {
  ayuda = {
    nombreayuda: '',
    descripcion: '',
    fechainicio: '',
    fechafin: '',
    objetivoFinaciero: 0,
    montonrecaudado: 0,
    ong: '' 
  };

  mensajesError: string[] = [];
  private cdr = inject(ChangeDetectorRef);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    //guardamo el CIF en el navegador
    const cifGuardado = localStorage.getItem('id');
    if (cifGuardado) {
      this.ayuda.ong = cifGuardado;
    } else {
      Swal.fire({
        title: 'Sesión no válida',
        text: 'No hemos podido identificar tu perfil de ONG. Por favor, vuelve a iniciar sesión por seguridad.',
        icon: 'error',
        confirmButtonText: 'Ir al Login',
        confirmButtonColor: '#1a365d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }
  }

  crearNuevaAyuda() {
    this.mensajesError = [];

    this.authService.crearAyuda(this.ayuda).subscribe({
      next: (respuesta) => {
        Swal.fire({
          title: '¡Ayuda creada con éxito!',
          text: 'La nueva causa solidaria ya está publicada y disponible.',
          icon: 'success',
          timer: 2000, 
          showConfirmButton: false
        });
        this.router.navigate(['/gestionayudas']); 
      },
      error: (error) => {
        console.error('Hubo un error al crear la ayuda.', error);
        if (error.error && typeof error.error === 'object') {
          for (const campo in error.error) {
            const mensajes = error.error[campo];
            if (Array.isArray(mensajes)) {
              this.mensajesError.push(`${campo.toUpperCase()}`);
            } else {
              this.mensajesError.push(`${campo.toUpperCase()}`);
            }  
          }
        
        } else {
          this.mensajesError.push('Error de conexión con el servidor. Inténtalo más tarde.');
        }
        this.cdr.detectChanges();
      }
    });
  }
}