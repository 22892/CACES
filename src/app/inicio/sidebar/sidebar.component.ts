import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginLogautService } from 'src/app/access-data/service/login-logaut.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

interface dataMenu {
  level: number, 
  disabled: boolean, 
  selected: boolean, 
  men_path: string, 
  men_icono: string, 
  men_titulo: string, 
  menusHijos: dataMenu[],
  codigo: string 
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  looggerUser: any
  usuario: any
  matriz: any[] = []
  menus: any[] = []
  matriz$!: Observable<any[]>;
  menus$!: Observable<any>;
  
  aux: any
  carpetaAcceso: any = ""

  tamanoMenu: number = 0
  variablesesion: any
  totalMensajes: number = 0
  objetoUsuario: any

  constructor(private loginService: LoginLogautService,
     private router: Router,
     private msj: NzMessageService, ) {


      this.looggerUser = localStorage.getItem('usuario')
      this.usuario = JSON.parse(this.looggerUser)

      
      this.loginService.actualizarMensajes.subscribe((value)=>{
        if(!value){

          this.listadoMesajes(this.usuario.id)

        }
      })



      if(this.usuario.tipo == "3" || this.usuario.tipo == "2"){

        this.menus = []
        this.tamanoMenu = 600
        this.matriz$ = this.loginService.getAllCriterios()

        this.aux = this.matriz$.subscribe({
          next: (matriz =>{

            this.matriz = matriz

            if(this.matriz.length > 0){
              
              this.matriz.forEach((criterio)=>{

                let objetoMenu: dataMenu = {
                  level: 1, 
                  disabled: false, 
                  selected: false, 
                  men_path: '', 
                  men_icono: '', 
                  men_titulo: criterio.criterio_descripcion, 
                  menusHijos: [],
                  codigo: criterio.codigo_criterio
                }


                criterio.subcriterio.forEach((subcri: any)=>{

                    
                    let objCriterio: dataMenu = {
                      level: 2, 
                      disabled: false, 
                      selected: false, 
                      men_path: '', 
                      men_icono: '', 
                      men_titulo: subcri.subcriterio_descripcion, 
                      menusHijos: [],
                      codigo: subcri.codigo_subcriterio 
                    }

                    objetoMenu.menusHijos = [... objetoMenu.menusHijos, objCriterio]


                })

                objetoMenu.menusHijos.forEach((sub: any)=>{


                  criterio.indicador.forEach((indica: any)=>{

                    //const result = criterio.indicador.find( (cod: { codigo_subcriterio: any; }) => cod.codigo_subcriterio === sub.codigo );

                    if(indica.codigo_subcriterio === sub.codigo){
                      let objIndicador: dataMenu = {
                        level: 3, 
                        disabled: false, 
                        selected: false, 
                        men_path: '', 
                        men_icono: '', 
                        men_titulo: indica.indicador_descripcion, 
                        menusHijos: [],
                        codigo: indica.codigo_indicador 
                      }

                      sub.menusHijos = [... sub.menusHijos, objIndicador]

                    }

                  })


                })

                this.menus = [... this.menus, objetoMenu]

              })


            }
            
            console.log('menu')
            console.log(this.menus)
      
            this.aux.unsubscribe()
            
          
          }),
          error: (erro =>{
            
            this.msj.error('ERROR AL OBTENER MENU PRINCIPAL '+erro.message)
           })
        });
          
      }else{

        this.tamanoMenu = 300
        
        this.menus$ = this.loginService.getDatosMenuAdministrador()
        this.aux = this.menus$.subscribe(p => {
          
          this.menus = p.menusadmin
        
          if(p.cargando == false){
            this.aux.unsubscribe()
          }
        });
  
       
      }

 
  }

  logaut(){
    this.loginService.logaut().then(response =>{

      localStorage.removeItem('indicador')
      localStorage.removeItem('usuario')
      
      this.router.navigate(['/'])

    }).catch(error=>{
      this.msj.error('ERROR AL SALIR')
    })
  }

  seleccionarMenu(menu: any){

    this.carpetaAcceso = menu.men_titulo


    if(menu.level === 1 || menu.level === 2){
      this.loginService.eventoMenu.next(false)

    }
    
    if(menu.level === 3){
      console.log('cliiiii')
      console.log(menu)
      console.log(this.usuario)

      if(this.usuario.tipo === '2'){
        localStorage.setItem('indicador', JSON.stringify({codigo_indicador: menu.codigo}));
        this.loginService.eventoMenu.next(true)
      }

      if(this.usuario.tipo === '3'){
        
        const resul = this.usuario.listaAccesos.find( (cod: any) => cod.codigo_indicador === menu.codigo)
        console.log('resultadododood')
        console.log(resul)
        if(resul){
          localStorage.setItem('indicador', JSON.stringify({codigo_indicador: menu.codigo}));
          this.loginService.eventoMenu.next(true)

        }else{
          this.loginService.eventoMenu.next(false)
          
        }

      }

    }
  }

  irMensajes(){
    this.router.navigate(['/multimedia/mensajes'])
  }

  listadoMesajes(id: any){
    this.totalMensajes = 0
    this.loginService.obtenerDatosUsuario(id).then(async res =>{

      this.objetoUsuario = await res.data()

      if(this.objetoUsuario){
        
        this.objetoUsuario.listaMensajes.forEach((mens: any)=>{
          if(mens.estado === false && mens.tipo == 'Recibido'){
            this.totalMensajes = this.totalMensajes + 1
          }
        })
      }

    }).catch((error)=>{
      this.msj.error('ERROR AL RECUPERAR DATOS USUAIRO')
    })
  }

}
