import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credenciales = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
     //para comprobar la contraseña
    this.authService.login(this.credenciales).subscribe({
      next: (respuesta: any) => {
        //guardamos el token, el rol y el dni o cif
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol); 
        localStorage.setItem('id', respuesta.id); 
        localStorage.setItem('cartera', respuesta.cartera ? respuesta.cartera.toString() : '0');
        
        if (respuesta.rol === 'donante') {
          this.router.navigate(['/ayudas']); //si es usuario lo mandamos a ver las ayudas
          
        } else if (respuesta.rol === 'ong') {
          this.router.navigate(['/gestionayudas']); //si es ong lo mandamos a ver las gestiones de su ayudas
          
        }
        
      },
      error: (err) => {
        Swal.fire({
          title: '¡Error!',
          text: 'Usuario o contraseña incorrectos',
          icon: 'error',
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#1a365d'
        });
      }
      
    });
  }
}