import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-ong',
  imports: [FormsModule],
  templateUrl: './registro-ong.html',
  styleUrl: './registro-ong.css',
})
export class RegistroOng {

  ong = {
    cif: '',
    nombrecompleto: '',
    email: '',
    clave:'',
    iban: '',
    estado: 'Pendiente' 
  };
//Para guardar el archivo
  documentoAcreditativo: File | null = null; 
  mensajesError: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  //añadimos el archivo seleccionado
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.documentoAcreditativo = file;
    }
  }

  registrarONG() {
    //guardamos los datos para poder enviarselo a Dajngo(con formdata)
    const formData = new FormData();
    formData.append('cif', this.ong.cif);
    formData.append('nombrecompleto', this.ong.nombrecompleto);
    formData.append('email', this.ong.email);
    formData.append('clave', this.ong.clave);
    formData.append('iban', this.ong.iban);
    if (this.documentoAcreditativo) {
      formData.append('documentacionLegal', this.documentoAcreditativo); 
    }

    //enviamo el form
    this.authService.registrarONG(formData).subscribe({
      next: (respuesta) => {
        Swal.fire({
          title: '¡Registro completado!',
          text: 'Tu ONG se ha registrado correctamente y actualmente está pendiente de revisión.',
          icon: 'success',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1a365d'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']); 
          }
        });
      },
      error: (error) => {
        console.error('Error al guardar la ONG:', error); 
        
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
          title: 'No se pudo registrar la ONG',
          text: textoAlerta,
          icon: 'error',
          confirmButtonText: 'Revisar datos',
          confirmButtonColor: '#1a365d'
        });
      }
    });
  }
}