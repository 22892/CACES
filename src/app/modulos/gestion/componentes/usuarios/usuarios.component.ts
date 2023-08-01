import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginLogautService } from '../../../../access-data/service/login-logaut.service'
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Observable, Subject, filter, takeUntil, tap } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

interface ColumnItem {

  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
  width:string;
}


interface dataMatriz {
  criterio_descripcion: string,
  codigo_matriz: string,
  codigo_criterio: string,
  subcriterio: any[],
  indicador: any[]  
}

interface dataSubcriterio {
  subcriterio_descripcion: string,
  codigo_criterio: string,
  codigo_subcriterio: string    
}

interface dataIndicador {

  indicador_descripcion: string,
  codigo_criterio: string,
  codigo_subcriterio: string,
  codigo_indicador: string
}



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
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {

  listOfColumns: ColumnItem[] = [
    {
      width:'60px',
      name: 'EMAIL',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },
    {
      width:'70px',
      name: 'NOMBRE',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'60px',
      name: 'APELLIDO',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      width:'60px',
      name: 'TELEFONO',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      width:'60px',
      name: 'TIPO DE USUARIO',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      width:'90px',
      name: 'GESTIÓN USUARIOS',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];


  modalRegistro: boolean = false
  registerForm!: UntypedFormGroup;
  tipoUsuario: any
  buscarUsuario: any
  listUser: any[] = []
  listUserAux: any[] = []
  listUserRolesAsignados: any[] = []
  listUserRolesNoAsignados: any[] = []


  listUsuarios$!: Observable<any[]>;

  cargandoUsuario: boolean = false
  creandoUsuario: boolean = false
  sub: any
  subUsuario: any
  modalGestionRoles: boolean = false
  itemMatrizIndicador: any
  usuarioSeleccionado: any

  listCriterio: any[] = []
  listCriterio$!: Observable<any[]>;
  cargandoMatriz: boolean = false
  nuevaListaAccesos: any[] = []
  listaAux: any[] = []
  indice: number = 0

  constructor(private fb: UntypedFormBuilder, 
    private router: Router,
    private msg: NzMessageService,
    private loginService: LoginLogautService
   ) {

    this.obtenerListadoUsuarios()


  }

   ngOnInit(): void {
   

    this.registerForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      tipo: [null, []],
      
    });

  }





  crearUsuario(){
    this.registrarse()
  }

  
  openModalRegistro(){
    this.modalRegistro = true
  }

  filtroBuscarUsuario(){

    if (this.buscarUsuario == '' || this.buscarUsuario == null) {
      this.listUser = this.listUserAux
    }else{
      this.listUser = this.listUserAux.filter((item: any) => item.email.toUpperCase().indexOf(this.buscarUsuario.toUpperCase()) !== -1 ||  item.nombre.toUpperCase().indexOf(this.buscarUsuario.toUpperCase()) !== -1 || item.apellido.toUpperCase().indexOf(this.buscarUsuario.toUpperCase()) !== -1);
    }

  }

  cancel(){
    this.msg.info('OPERACIÓN CANCELADA')
  }

  eliminarUsuario(usuario: any){


    let user = this.loginService.ejemplo()
    console.log(user)

    /*this.loginService.deleteUserAutentication(usuario.id).then(r =>{

      console.log('elmkmina')
      console.log(r)

    }).catch(err =>{
      this.msg.error('ERROR AL ELIMINAR USUARIO '+err.message)
    })*/

    /*this.loginService.deleteUsuario(usuario.id).then(res=>{

      console.log('respuesta')
      console.log(res)

    }).catch(error=>{
      this.msg.error('NO SE PUEDE ELIMINAR USUARIO.... INTENETE NUEVAMENTE '+error.message)
    })*/
  }


  openModalAccesos(usuario: any){

    console.log('si se actualiza ')
    this.listUserRolesAsignados = []
    this.modalGestionRoles = true
    this.usuarioSeleccionado = usuario
    this.listUserRolesAsignados = usuario.listaAccesos
    this.obtenerTodosCriterios()

    
  }


  registrarse(){

    this.creandoUsuario = true

    this.loginService.register(this.registerForm.value).then(response =>{

      this.msg.info('USUARIO REGISTRADO CORRECTAMENTE')

      const id = response.user.uid

      let usuario: dataUsuario  = {

        email: this.registerForm.get('email')!.value,
        nombre: this.registerForm.get('name')!.value,
        apellido: this.registerForm.get('lastname')!.value,
        telefono: String (this.registerForm.get('phone')!.value),
        id: id,
        tipo: this.registerForm.get('tipo')!.value,
        listaAccesos: [],
        listaMensajes: []

      }

      

      this.loginService.crearDocumentoUsuario(usuario).then(resp =>{

        this.msg.success('USUARIO GUARDADO')
        this.creandoUsuario = false
        this.registerForm.reset()
        this.obtenerListadoUsuarios()
        this.modalRegistro = false

      }).catch(err =>{
        this.creandoUsuario = false
        this.msg.error('ERROR AL GUARDAR USUARIO '+err.mensaje)
      })


    }).catch(error =>{
      this.creandoUsuario = false
      this.msg.error('HA OCURRIDO UN ERROR '+error.message)
     
    })
  }


  obtenerListadoUsuarios(){

    this.cargandoUsuario = true

    this.listUsuarios$ = this.loginService.getAllUsuario()

    this.subUsuario = this.listUsuarios$.subscribe({
      next: (data =>{
       
        this.listUser = data
        this.listUserAux = data

       
        this.subUsuario.unsubscribe()
        this.cargandoUsuario = false

      }),
      error: (err =>{
        this.cargandoUsuario = false
        this.msg.error('ERROR AL RECUPERAR USUARIOS '+err)
      })
    });

  }


  cerraModalRoles(){

    this.modalGestionRoles = false
  }


  drop(event: CdkDragDrop<string[]>, tipoAsignar: any) {


    console.log('evevttttt')
    console.log(event)

    if (event.previousContainer === event.container) {
      
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      const prev_idx = event.previousIndex;
      this.itemMatrizIndicador = event.previousContainer.data[prev_idx];


      if(tipoAsignar == 'asignado'){


        this.nuevaListaAccesos = this.usuarioSeleccionado.listaAccesos.filter((item: any) => item.codigo_indicador !== this.itemMatrizIndicador.codigo_indicador)


        let objUsuario: dataUsuario = {

          email: this.usuarioSeleccionado.email,
          nombre: this.usuarioSeleccionado.nombre,
          apellido: this.usuarioSeleccionado.apellido,
          telefono: this.usuarioSeleccionado.telefono,
          id: this.usuarioSeleccionado.id,
          tipo: this.usuarioSeleccionado.tipo,
          listaAccesos: this.nuevaListaAccesos,
          listaMensajes: []

        }

        this.loginService.updateUsuario(objUsuario).then(resp =>{

          this.msg.success('ACCESO AL INDICADOR QUITADO')
         
          
        }).catch(err =>{
          this.msg.error('NO SE PUDO QUITAR ACCESO AL INDICADOR '+err.mensaje)
        })




      }

      if(tipoAsignar == 'asignar'){


        console.log('entraaaaaaaaaaaaaaaaa asignar')

        console.log(this.itemMatrizIndicador)

        let objUsuario: dataUsuario = {

          email: this.usuarioSeleccionado.email,
          nombre: this.usuarioSeleccionado.nombre,
          apellido: this.usuarioSeleccionado.apellido,
          telefono: this.usuarioSeleccionado.telefono,
          id: this.usuarioSeleccionado.id,
          tipo: this.usuarioSeleccionado.tipo,
          listaAccesos: this.usuarioSeleccionado.listaAccesos,
          listaMensajes: []

        }

        let objetoAcceso: any = {

          codigo_indicador: this.itemMatrizIndicador.codigo_indicador,
          indicador_descripcion: this.itemMatrizIndicador.indicador_descripcion,
          criterio_descripcion: this.itemMatrizIndicador.criterio_descripcion,
          subcriterio_descripcion: this.itemMatrizIndicador.subcriterio_descripcion,
          acceso: 1

        }

        objUsuario.listaAccesos = [... objUsuario.listaAccesos, objetoAcceso]

        this.loginService.updateUsuario(objUsuario).then(resp =>{

          console.log('que rsponde')
          console.log(resp)
          this.msg.success('INDICADOR ASIGNADO')
         
          
        }).catch(err =>{
          this.msg.error('NO SE PUDO AGREGAR INDICADOR '+err.mensaje)
        })


      }


      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  obtenerTodosCriterios(){

    console.log()

    this.listUserRolesNoAsignados = []
    this.listaAux = []
    this.cargandoMatriz = true
    this.listCriterio$ = this.loginService.getAllCriterios()
  
    this.sub = this.listCriterio$.subscribe({
      next: (data =>{

       
        this.listCriterio = data

        if(this.listCriterio.length>0){

    
          this.listCriterio.forEach((item: any)=>{
           

            if(item.indicador.length > 0){
              item.indicador.forEach((indica: any)=>{

                const resultado = item.subcriterio.find( (cod: { codigo_subcriterio: any; }) => cod.codigo_subcriterio === indica.codigo_subcriterio );

                let objetoIndicador = {
                  codigo_indicador: indica.codigo_indicador,
                  criterio_descripcion: item.criterio_descripcion,
                  subcriterio_descripcion: resultado.subcriterio_descripcion,
                  indicador_descripcion: indica.indicador_descripcion,
                  acceso: 1
                }
    
                this.listaAux = [... this.listaAux, objetoIndicador]
    
              })
            }
          })

          if(this.listUserRolesAsignados.length>0){
            this.quitarElemntorepetido(0, this.listaAux, this.listUserRolesAsignados)

          }else{
            this.listUserRolesNoAsignados = this.listaAux
          }


        }

        this.sub.unsubscribe()
        this.cargandoMatriz = false

      }),
      error: (err =>{
        this.cargandoMatriz = false
        this.msg.error('ERROR AL RECUPERAR CRITERIO '+err)
      })
    });

  }
  


  quitarElemntorepetido(aux: number, listaComleta: any[], listaAsignados: any[]){


    if (aux < listaAsignados.length){
      this.listUserRolesNoAsignados = listaComleta.filter((item: any) => item.codigo_indicador !== listaAsignados[aux].codigo_indicador)
      aux = aux + 1
      this.quitarElemntorepetido(aux, this.listUserRolesNoAsignados, listaAsignados)

    }

  }

}
