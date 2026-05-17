import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //URL de Django
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  registrarDonante(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro/usuario/`, datos);
  }

  registrarONG(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro/ong/`, datos);
  }

  login(credenciales: any): Observable<any> {
    //Manda el email y contraseña a Django
    return this.http.post(`${this.baseUrl}/login/`, credenciales);
  }

  //Ayudas de una ONG
  obtenerAyudas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ayudas/`);
  }
  crearAyuda(datosAyuda: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ayudas/`, datosAyuda);
  }

  //Ayudas para los detalles(ONG)
  obtenerAyudaPorId(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ayudas/${id}/`);
  }
  actualizarAyuda(id: string, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ayudas/${id}/`, datos);
  }
  eliminarAyuda(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ayudas/${id}/`);
  }
  cancelarAyuda(id: string): Observable<any> {
    //Enviamos solo el estado para cancelarlo
    return this.http.patch(`${this.baseUrl}/ayudas/${id}/`, { estado: 'X' });
  }

  //Perfil
  obtenerPerfil(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/perfil/${id}/`); 
  }
  actualizarPerfil(id: string, datosActualizados: any) {
    return this.http.patch(`${this.baseUrl}/perfil/${id}/`, datosActualizados);
  }

  //Evidencias
  subirEvidencia(datos: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/evidencias/`, datos);
  }


  obtenerTodasLasAyudas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ayudas/`);
  }


  obtenerRolActual(): string | null {
    return localStorage.getItem('rol');
  }
  estaLogueado(): boolean {
    //Comprobamos si existe un token
    return !!localStorage.getItem('token');
  }

  hacerDonacion(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/donaciones/`, datos);
  }

  obtenerMisDonaciones(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/donaciones/?dniusuario=${dni}`);
  }
}