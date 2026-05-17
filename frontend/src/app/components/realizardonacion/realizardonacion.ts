import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-realizardonacion',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './realizardonacion.html',
  styleUrl: './realizardonacion.css',
})
export class Realizardonacion implements OnInit {
  ayudaId: string | null = null;
  ayuda: any = null;
  cantidad: number = 0;
  procesando: boolean = false;
  cargandoDatos: boolean = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    //cogemos el id
    this.ayudaId = this.route.snapshot.paramMap.get('id');
    if (this.ayudaId) {
      this.authService.obtenerAyudaPorId(this.ayudaId).subscribe({
        next: (datos) => {
          this.ayuda = datos;
          this.cargandoDatos = false;
          //Fuerzo a Angular para que pinte los datos 
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error al cargar la ayuda:', err);
          this.cargandoDatos = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmarDonacion() {
    const saldoStorage = localStorage.getItem('cartera');
    const saldoDisponible = saldoStorage ? Number(saldoStorage) : 0;
    console.log("Saldo: ", saldoDisponible)
    
    
    if (this.cantidad <= 0) {
      Swal.fire({
        title: 'Se requiere una cantidad',
        text: 'Añade una cantidad antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1a365d'
      });
      
      return;
    }

    if (this.cantidad > saldoDisponible) {
      Swal.fire({
        title: 'Saldo insuficiente',
        text: `No tienes saldo suficiente. Tu saldo disponible actual es de ${saldoDisponible}€.`,
        icon: 'warning',
        confirmButtonText: 'Modificar cantidad',
        confirmButtonColor: '#1a365d'
      });
      
      return;
    }

    const donanteId = localStorage.getItem('id');
        console.log("Dni donante: ", donanteId )

    if (!donanteId || !this.ayudaId) {
      Swal.fire({
        title: 'Datos no encontrados',
        text: 'No hemos podido identificar tu sesión o la causa a la que quieres donar.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1a365d'
      });
      return;
    }

    this.procesando = true;

    const datosDonacion = {
      ayuda: this.ayudaId,
      dniusuario: donanteId,
      cantidad: this.cantidad,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'A'
    };

    //Lo enviamo al sv
    this.authService.hacerDonacion(datosDonacion).subscribe({
      next: (respuesta) => {
        Swal.fire({
        title: '¡Muchísimas gracias!',
        text: 'Gracias por tu generosidad y por ayudar a esta causa.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1a365d'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/ayudas']); 
        }
      });
        
        //Actualizamos el saldo
        const nuevoSaldo = saldoDisponible - this.cantidad;
        localStorage.setItem('cartera', nuevoSaldo.toString());

        const usuarioJson = localStorage.getItem('usuario');
        if (usuarioJson) {
          const usuarioObj = JSON.parse(usuarioJson);
          usuarioObj.cartera = nuevoSaldo;
          localStorage.setItem('usuario', JSON.stringify(usuarioObj));
        }

        this.router.navigate(['/donaciones']);
      },
      error: (err) => {
        console.error('Error al donar:', err);
        // alert('Hubo un problema al procesar la donacion.');
        this.procesando = false;
        this.cdr.detectChanges();

        let mensajeAlerta = 'Hubo un problema al procesar la donación.';

        if (err.error && err.error.error && err.error.error.length > 0) {
          mensajeAlerta = err.error.error[0]; 
        } else if (err.error && typeof err.error === 'string') {
          mensajeAlerta = err.error;
        }
        Swal.fire({
          title: 'No se pudo completar',
          text: mensajeAlerta,
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1a365d'
        });
      }
    });
  }
}