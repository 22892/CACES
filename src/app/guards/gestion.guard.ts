import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GestionGuard implements CanActivate {

  looggerUser: any
  usuario: any

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.verificacionAcceos()){
        return true;
      }

      this.router.navigate(['/login'])
      return false

  }

  verificacionAcceos(): boolean {
    this.looggerUser = localStorage.getItem('usuario')
    this.usuario = JSON.parse(this.looggerUser)
    

    if(this.usuario.tipo === '1'){
      return true

    }

    return false
 
  }

  
}
