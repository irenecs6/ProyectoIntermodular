import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-donante',
  imports: [FormsModule],
  templateUrl: './registro-donante.html',
  styleUrl: './registro-donante.css',
})
export class RegistroDonante {
  donante = {
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    clave: '',
    telefono: '',
    fechanacimiento: ''
  };

  mensajesError: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  registrarDonante() {
    this.mensajesError = [];
    console.log('Datos listos para enviar a Django:', this.donante);
    //Se lo enviamos a Django
    this.authService.registrarDonante(this.donante).subscribe({
      next: (respuesta) => {
        Swal.fire({
        title: '¡Usuario guardado!',
        text: 'Tus datos se han registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#1a365d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']); 
        }
      });
      },
      // error: (error) => {
      //   console.log('Hubo un error al guardar el usuario.');
      //   if (error.error && typeof error.error === 'object') {
      //     for (const campo in error.error) {
      //       this.mensajesError.push(`${campo.toUpperCase()}`);
      //     }
        
      //   } else {
      //     this.mensajesError.push('Error de conexión con el servidor. Inténtalo más tarde.');
      //   }
      // }

      error: (error) => {
        console.error('Error al guardar el usuario:', error);
        
        this.mensajesError = []; 
        let textoAlerta = '';

        if (error.error && typeof error.error === 'object') {
          for (const campo in error.error) {
            this.mensajesError.push(`${campo.toUpperCase()}`);
          }
          textoAlerta = 'Revisa los siguientes campos: ' + this.mensajesError.join(', ');
        } else {
          textoAlerta = 'Error de conexión con el servidor. Inténtalo más tarde.';
          this.mensajesError.push(textoAlerta);
        }
        Swal.fire({
          title: 'No se pudo guardar',
          text: textoAlerta,
          icon: 'error',
          confirmButtonText: 'Revisar datos',
          confirmButtonColor: '#1a365d'
        });
      }
    });
  }
}
