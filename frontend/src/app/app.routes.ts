import { Routes } from '@angular/router';
import { inject } from '@angular/core'; // Sirve para "inyectar" herramientas dentro de funciones
import { Router } from '@angular/router';
import { RegistroDonante } from './components/registro-donante/registro-donante';
import { RegistroOng } from './components/registro-ong/registro-ong';
import { Inicio } from './components/inicio/inicio';
import { Login } from './components/login/login';
import { Ayudas } from './components/ayudas/ayudas';
import { AyudasONG } from './components/ayudas-ong/ayudas-ong'; 
import { Perfil } from './components/perfil/perfil'; 
import { Creacionayudas } from './components/creacionayudas/creacionayudas'; 
import { Donaciones } from './components/donaciones/donaciones';
import { Detalleayuda } from './components/detalleayuda/detalleayuda';
import { Realizardonacion } from './components/realizardonacion/realizardonacion';
import { VerIncidencia } from './components/ver-incidencia/ver-incidencia'; 

//Permisos de autentificacion
const authGuard = () => {
  const router = inject(Router);
  
  //Hay token?
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //si no hay token no hay nadie logueado
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true; 
};

const ongGuard = () => {
  const router = inject(Router);
  //tiene un rol?
  const rol = typeof window !== 'undefined' ? localStorage.getItem('rol') : null;

  //si no es ong no le dejo pasar a las ayudas
  if (rol !== 'ong') {
    console.log('Necesita rol de ONG: ', rol);
    router.navigate(['/ayudas']);
    return false;
  }
  return true;
};

export const routes: Routes = [
    { path: '', component: Inicio },
    { path: 'registro-donante', component: RegistroDonante },
    { path: 'registro-ong', component: RegistroOng },
    { path: 'login', component: Login },
    { path: 'ayudas', component: Ayudas },
    { path: 'ayuda-detalle/:id', component: VerIncidencia, canActivate: [authGuard]},

    { path: 'donar/:id', component: Realizardonacion, canActivate: [authGuard]},
    { path: 'donaciones', component: Donaciones, canActivate: [authGuard]},
    { path: 'perfil', component: Perfil, canActivate: [authGuard]},
    { path: 'creacionayudas', component: Creacionayudas, canActivate: [authGuard, ongGuard] },
    { path: 'gestionayudas', component: AyudasONG, canActivate: [authGuard, ongGuard] },
    
    { path: 'detalles/:id', component: Detalleayuda },
    { path: '**', redirectTo: '' } // Si hay error, vuelve al inicio
];
