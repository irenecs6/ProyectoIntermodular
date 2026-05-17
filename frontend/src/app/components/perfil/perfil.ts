import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})

export class Perfil implements OnInit{
  rol: string = '';
  userId: string = '';
  datosPerfil: any = null;
  cargando: boolean = true;

  modoEdicion: boolean = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    //para evitar errores el SSR de angular
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      
      this.rol = localStorage.getItem('rol') || '';
      this.userId = localStorage.getItem('id') || '';

      if (this.userId) {
        console.log('petición a Django con userId:', this.userId);
        this.cargarDatos();
      } else {
        console.log('Fallo: No hay userId en el localStorage');
        this.cargando = false;
        this.cdr.detectChanges(); 
      }
      
    } else {
      this.cargando = false;
    }
  }

  cargarDatos() {
    this.authService.obtenerPerfil(this.userId!).subscribe({
      next: (datos) => {
        console.log('Datos recibdos de Django:', datos);
        this.datosPerfil = datos;
        this.cargando = false;
        //forzamos a que actualice la pag
        this.cdr.detectChanges();
        },
      error: (err) => {
        console.error('Error al cargar el perfil:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    //le pedimos los datos por si se a modificado algo
    this.cargarDatos(); 
  }

  guardarCambios() {
    this.cargando = true;
    this.authService.actualizarPerfil(this.userId, this.datosPerfil).subscribe({
      next: (respuesta) => {
        this.modoEdicion = false;
        this.cargarDatos();
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        Swal.fire({
          title: 'Error de actualización',
          text: 'Hubo un problema al intentar actualizar los datos.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1a365d'
        });
      console.error(err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}