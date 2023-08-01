import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginLogautService } from '../../access-data/service/login-logaut.service'
import { Observable, Subject, filter, takeUntil, tap } from 'rxjs';
import 'moment/locale/es';
import * as moment from 'moment';

interface dataUsuario {

  email: string
  nombre: string
  apellido: string
  telefono: string
  id: string
  tipo: string
  listaAccesos: any[]
  listaMensajes: any[]

}


@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent {

  buscarMensaje: any
  cargandoMensajes: boolean = false
  listaMensajes: any [] = []
  listaMensajesAux: any [] = []
  loadingMensaje: boolean = false
  modalMensaje: boolean = false
  form: UntypedFormGroup;
  listUsuarios$!: Observable<any[]>;
  cargandoUsuario: boolean = false
  subUsuario: any
  listUser: any[] = []
  looggerUser: any
  usuarioEmisor: any
  userLogger: any
  usuarioReceptor: any
  todos: any
  enviados: any
  recibidos: any
  datosUsuairo: any
  isReadMore = true;
  visible: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private loginService: LoginLogautService) {

      this.form = this.formBuilder.group({
        comment: [null, [Validators.maxLength(100)]],
        receptor: [null, []]
      });

      this.obtenerListadoUsuarios()
      this.looggerUser = localStorage.getItem('usuario')
      this.usuarioEmisor = JSON.parse(this.looggerUser)
      this.todos = true
      this.obtenerListadoMensajes(this.usuarioEmisor.id, 1)
  }

  openModalMensaje(){
    this.modalMensaje = true
  }

  filtroBuscarMensaje(){

    if (this.buscarMensaje == '' || this.buscarMensaje == null) {
      this.listaMensajes = this.listaMensajesAux
    }else{
      this.listaMensajes = this.listaMensajesAux.filter((item: any) => item.usuario.nombre.toUpperCase().indexOf(this.buscarMensaje.toUpperCase()) !== -1 ||  item.usuario.apellido.toUpperCase().indexOf(this.buscarMensaje.toUpperCase()) !== -1 );
    }

  }

  eliminarMensaje(mensaje: any){
    console.log(mensaje)
  }


  enviarMensaje(){

    if(this.validateForms()){

      this.loadingMensaje = true

      this.looggerUser = localStorage.getItem('usuario')
      this.usuarioEmisor = JSON.parse(this.looggerUser)
      this.usuarioReceptor = this.form.get('receptor')!.value

      const id = Math.random().toString(36).substring(2);


      let mensajeRceptor: any  = {

        fecha: new Date(),
        mensaje: this.form.get('comment')!.value,
        usuario: this.usuarioEmisor,
        estado : false,
        tipo: 'Recibido',
        id: id

      }

      let objUsuarioReceptor: dataUsuario = {

        email: this.usuarioReceptor.email,
        nombre: this.usuarioReceptor.nombre,
        apellido: this.usuarioReceptor.apellido,
        telefono: this.usuarioReceptor.telefono,
        id: this.usuarioReceptor.id,
        tipo: this.usuarioReceptor.tipo,
        listaAccesos: this.usuarioReceptor.listaAccesos,
        listaMensajes: this.usuarioReceptor.listaMensajes

      }

      objUsuarioReceptor.listaMensajes = [... objUsuarioReceptor.listaMensajes, mensajeRceptor]

      this.loginService.updateUsuario(objUsuarioReceptor).then(resp =>{


        const idDos = Math.random().toString(36).substring(2);

        let mensajeEmisor: any  = {

          fecha: new Date(),
          mensaje: this.form.get('comment')!.value,
          usuario: this.usuarioReceptor,
          estado : false,
          tipo: 'Enviado',
          id: idDos
  
        }
  
        let objUsuarioEmisor: dataUsuario = {
  
          email: this.usuarioEmisor.email,
          nombre: this.usuarioEmisor.nombre,
          apellido: this.usuarioEmisor.apellido,
          telefono: this.usuarioEmisor.telefono,
          id: this.usuarioEmisor.id,
          tipo: this.usuarioEmisor.tipo,
          listaAccesos: this.usuarioEmisor.listaAccesos,
          listaMensajes: this.usuarioEmisor.listaMensajes
  
        }

        objUsuarioEmisor.listaMensajes = [... objUsuarioEmisor.listaMensajes, mensajeEmisor]

        this.loginService.updateUsuario(objUsuarioEmisor).then(r =>{

          this.msg.success('MENSAJE ENVIADO')
          this.form.reset()
          this.modalMensaje = false
          this.loadingMensaje = false


          this.loginService.obtenerDatosUsuario(this.usuarioEmisor.id).then(async res =>{


            if(res.data()){
    
              this.obtenerListadoUsuarios()
              localStorage.setItem('usuario', JSON.stringify(await res.data()));

              this.looggerUser = localStorage.getItem('usuario')
              this.usuarioEmisor = JSON.parse(this.looggerUser)
              this.todos = true
              this.obtenerListadoMensajes(this.usuarioEmisor.id, 1)
        
              this.loginService.actualizarMensajes.next(false)
       
            }else{
              this.msg.error('ERROR EN RECUPERAR DATOS DE USUARIO')
              this.router.navigate(['/'])
    
    
            }
    
           
          }).catch(err =>{
            this.msg.error('NO SE PUDO OBTENR DATOS USUARIO '+err.mensaje)
          })
    


  
        }).catch(er =>{
          this.msg.error('ERROR AL ACTUALIZAR ENVIO MENSAJE')
          this.loadingMensaje = false
        })
        
      }).catch(err =>{
        this.msg.error('NO SE PUDO ENVIAR EL MENSAJE '+err.mensaje)
        this.loadingMensaje = false
      })
    }

  }

  validateForms(): boolean {
    let v = true;
    if (!this.form.valid) {
      this.msg.warning("VERIFICAR LA CANTIDAD DE CARACTERES");
      return false;
    }
    return v;
  }


  obtenerListadoUsuarios(){

    this.cargandoUsuario = true

    this.listUsuarios$ = this.loginService.getAllUsuario()

    this.subUsuario = this.listUsuarios$.subscribe({
      next: (data =>{
       
        this.listUser = data

        this.subUsuario.unsubscribe()
        this.cargandoUsuario = false

      }),
      error: (err =>{
        this.cargandoUsuario = false
        this.msg.error('ERROR AL RECUPERAR USUARIOS '+err)
      })
    });

  }

  filtroMensajes(tipoFiltro: any){

    this.looggerUser = localStorage.getItem('usuario')
    this.usuarioEmisor = JSON.parse(this.looggerUser)


    if(tipoFiltro == 1){
      this.enviados = false
      this.recibidos = false
      this.obtenerListadoMensajes(this.usuarioEmisor.id, 1)
    }
    if(tipoFiltro == 2){
      this.todos = false
      this.recibidos = false
      this.obtenerListadoMensajes(this.usuarioEmisor.id, 2)
    }
    if(tipoFiltro == 3){
      this.enviados = false
      this.todos = false
      this.obtenerListadoMensajes(this.usuarioEmisor.id, 3)
    }
    
  }

  obtenerListadoMensajes(id: any, tipo: number){

    this.listaMensajes = []
    this.listaMensajesAux = []
    this.loginService.obtenerDatosUsuario(id).then(async res =>{

     
      this.datosUsuairo = await res.data()
      if(this.datosUsuairo){

        
        if(tipo == 1){

          this.datosUsuairo.listaMensajes.forEach((obj: any)=>{

            let fec= new Date(obj.fecha.seconds * 1000)
            obj.fechaNueva = moment(fec).format('L')
            obj.hora = moment(fec).format('LT')
            obj.msj = obj.mensaje.substring(0, 40) 
            obj.texto = 'Mensaje Enviado'
            this.listaMensajes = [... this.listaMensajes, obj]
            this.listaMensajesAux = [... this.listaMensajesAux, obj]
            

          })

        }

        if(tipo == 2){

          this.datosUsuairo.listaMensajes.forEach((obj: any)=>{
            if(obj.tipo == 'Enviado'){
              let fec= new Date(obj.fecha.seconds * 1000)
              obj.fechaNueva = moment(fec).format('L')
              obj.hora = moment(fec).format('LT')
              obj.msj = obj.mensaje.substring(0, 40) 
              obj.texto = 'Mensaje Enviado'
              this.listaMensajes = [... this.listaMensajes, obj]
              this.listaMensajesAux = [... this.listaMensajesAux, obj]
            }
          })

        }

        if(tipo == 3){

          this.datosUsuairo.listaMensajes.forEach((obj: any)=>{
            if(obj.tipo == 'Recibido'){
              let fec= new Date(obj.fecha.seconds * 1000)
              obj.fechaNueva = moment(fec).format('L')
              obj.hora = moment(fec).format('LT')
              obj.msj = obj.mensaje.substring(0, 40) 
              obj.texto = 'Leer Mensaje'
              this.listaMensajes = [... this.listaMensajes, obj]
              this.listaMensajesAux = [... this.listaMensajesAux, obj]
            }
          })


        }

      }

      console.log('lista')
      console.log(this.listaMensajes)

    })

  }

  leerMensaje(mensaje: any){

    this.looggerUser = localStorage.getItem('usuario')
    this.userLogger = JSON.parse(this.looggerUser)

    let objUsuario: dataUsuario = {

      email: this.userLogger.email,
      nombre: this.userLogger.nombre,
      apellido: this.userLogger.apellido,
      telefono: this.userLogger.telefono,
      id: this.userLogger.id,
      tipo: this.userLogger.tipo,
      listaAccesos: this.userLogger.listaAccesos,
      listaMensajes: this.userLogger.listaMensajes

    }

    objUsuario.listaMensajes.forEach((item: any, index: number)=>{
      
      if(item.id === mensaje.id){

        let mensajeObj: any  = {

          fecha: mensaje.fecha,
          mensaje: mensaje.mensaje,
          usuario: mensaje.usuario,
          estado : true,
          tipo: mensaje.tipo,
          id: mensaje.id
    
        }

        objUsuario.listaMensajes[index] = mensajeObj
        
      }
    })

    this.loginService.updateUsuario(objUsuario).then(r =>{

      this.loginService.actualizarMensajes.next(false)
      localStorage.setItem('usuario', JSON.stringify(objUsuario));
    


    }).catch(error =>{
      this.msg.error('ERROR AL ACTUALIZAR '+error.message)
    })

  }

}
