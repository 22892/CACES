import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginLogautService } from 'src/app/access-data/service/login-logaut.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  looggerUser: any
  usuario: any
  menus: any[] = []
  menus$!: Observable<any>;
  aux: any
  carpetaAcceso: any = "/"


  constructor(private loginService: LoginLogautService,
     private router: Router,
     private msj: NzMessageService, ) {

      this.menus$ = this.loginService.getDatosMatriz()
      this.aux = this.menus$.subscribe(p => {
        
        this.menus = p.menus
        console.log('--------------------')
        console.log(this.menus)
        if(p.cargando == false){
          this.aux.unsubscribe()
        }
      });


      this.loginService.updateLogaut.subscribe( value => {

        if(value == true){

          this.looggerUser = localStorage.getItem('usuario')
          this.usuario = JSON.parse(this.looggerUser)

        }else{
          this.looggerUser = localStorage.getItem('usuario')
          this.usuario = JSON.parse(this.looggerUser)
        }

      })
 
  }

  logaut(){
    this.loginService.logaut().then(response =>{

      this.router.navigate(['/'])

    }).catch(error=>{
      this.msj.error('ERROR AL SALIR')
    })
  }

}
