import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalleayuda',
  imports: [FormsModule, CommonModule],
  templateUrl: './detalleayuda.html',
  styleUrl: './detalleayuda.css',
})
export class Detalleayuda implements OnInit {

  ayudaId: string = '';
  ayuda: any = null;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  get ayudaCompletada(): boolean {
    //si esta completada
    return this.ayuda ? this.ayuda.montonrecaudado >= this.ayuda.objetivoFinaciero : false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID: ', id);
    
    // cogemos su id
    this.ayudaId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.ayudaId) {
      this.authService.obtenerAyudaPorId(this.ayudaId).subscribe({
        next: (datos) => {
          this.ayuda = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar la ayuda', err)
      });
    }
  }

  guardarCambios() {
    if (this.ayuda) {
      if (this.ayuda.fechainicio) 
        this.ayuda.fechainicio = this.ayuda.fechainicio.split('T')[0];
      if (this.ayuda.fechafin) 
        this.ayuda.fechafin = this.ayuda.fechafin.split('T')[0];
      //PAsamos a numero antes de enviarlo
      this.ayuda.objetivoFinaciero = Number(this.ayuda.objetivoFinaciero);
    }

    this.authService.actualizarAyuda(this.ayudaId, this.ayuda).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Actualización exitosa!',
          text: 'Los datos de la ayuda se han guardado y actualizado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/gestionayudas']);
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        Swal.fire({
          title: '¡Ups! Algo salió mal',
          text: 'Hubo un problema al intentar actualizar los datos. Por favor, inténtalo de nuevo en unos instantes.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1a365d'
        });
      }
    });
  }
  
  borrarAyuda() {
    if (confirm('¿Estás seguro de que deseas eliminar esta ayuda?')) {
      this.authService.eliminarAyuda(this.ayudaId).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Eliminada!',
            text: 'La ayuda se ha borrado correctamente de la plataforma.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/gestionayudas']);
        },
        error: (err) => {
          console.error('Error al intentar eliminar:', err);
          Swal.fire({
            title: 'No se pudo eliminar',
            text: 'Ha ocurrido un problema al intentar borrar esta ayuda.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#1a365d'
          });
        }
      });
    }
  }

  cancelarAyuda() {
  if (confirm('¿Estás seguro de que deseas cancelar esta campaña? Esta acción es irreversible.')) {
    this.authService.cancelarAyuda(this.ayudaId).subscribe({
      next: () => {
        console.log('Campaña cancelada');
       if (this.ayuda) {
          this.ayuda.estado = 'X'; // 'X' de Cancelada
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al intentar cancelar la ayuda:', err);
        Swal.fire({
          title: 'No se pudo cancelar',
          text: 'Ha ocurrido un problema al intentar cancelar esta ayuda.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#1a365d'
        });
      }
    });
    }
  }


  // Variables para lasevidencia
  archivoSeleccionado: File | null = null;
  nuevaEvidencia = {
    descripcion: '',
    tipo: 'I', // 'I' de Imagen
    fechaGasto: '',
    montonjustificado: 0
  };

  //seleccionamos arcchivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  subirEvidencia() {
    if (!this.archivoSeleccionado || !this.nuevaEvidencia.fechaGasto || !this.nuevaEvidencia.descripcion) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos.',
        icon: 'warning',
        confirmButtonText: 'Revisar formulario',
        confirmButtonColor: '#1a365d'
      });
      return;
    }

    //Usamos FormData porque estamos enviando un archivo (FileField)
    const formData = new FormData();
    
    formData.append('ayuda', this.ayudaId); 
    formData.append('tipo', this.nuevaEvidencia.tipo);
    formData.append('descripcion', this.nuevaEvidencia.descripcion);
    formData.append('fechaGasto', this.nuevaEvidencia.fechaGasto);
    formData.append('montonjustificado', this.nuevaEvidencia.montonjustificado.toString());
    formData.append('archivo', this.archivoSeleccionado); 

    this.authService.subirEvidencia(formData).subscribe({
        next: (respuesta) => {
            Swal.fire({
              title: '¡Evidencia subida!',
              text: 'El archivo y los datos se han guardado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            
            //Limpiamos el formulario
            this.archivoSeleccionado = null;
            this.nuevaEvidencia = { descripcion: '', tipo: 'I', fechaGasto: '', montonjustificado: 0 };
            
            this.authService.obtenerAyudaPorId(this.ayudaId).subscribe({
                next: (datosActualizados) => {
                    this.ayuda = datosActualizados;
                    this.cdr.detectChanges(); // Forzamos a que Angular pinte los cambios
                }
            });
        },
        error: (err) => {
          console.error('Error del servidor:', err);
          Swal.fire({
            title: 'Error de subida',
            text: 'Hubo un problema al intentar subir el archivo.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#1a365d'
          });        
        }
    });
  }
}