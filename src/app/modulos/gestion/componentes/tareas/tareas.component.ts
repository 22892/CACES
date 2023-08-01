import { Component } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { LoginLogautService } from '../../../../access-data/service/login-logaut.service'
import { Observable, Subject, filter, takeUntil, tap } from 'rxjs';


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
  acceso: number
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
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent {

  modalMatriz: boolean = false
  tituloMatriz: string = ''
  datoMatrizForm!: UntypedFormGroup;


  matriz: NzTreeNodeOptions[] = [];
  cargandoMatriz: boolean = false

  index: number = 0;
  tabs = [
    {
      name: 'CRITERIO',
      icon: 'menu'
    },
    {
      name: 'SUBCRITERIO',
      icon: 'user-add'
    },
    {
      name: 'INDICADOR',
      icon: 'check-circle'
    }
  ];

  listOfColumns: ColumnItem[] = [
    {
      width:'40px',
      name: 'Código',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },
    {
      width:'70px',
      name: 'Descripción',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'60px',
      name: 'Agregar Subcriterio',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      width:'50px',
      name: 'Eliminar',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];


  listOfColumnsSubcriterio: ColumnItem[] = [
    {
      width:'40px',
      name: 'Código',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },
    {
      width:'70px',
      name: 'Descripción Criterio',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'70px',
      name: 'Descripción Subcriterio',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'60px',
      name: 'Agregar Indicador',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      width:'50px',
      name: 'Eliminar',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];


  listOfColumnsIndocador: ColumnItem[] = [
    {
      width:'40px',
      name: 'Código',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },
    {
      width:'70px',
      name: 'Descripción Criterio',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'70px',
      name: 'Descripción Subcriterio',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

    {
      width:'70px',
      name: 'Descripción Indicador',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: true,
      listOfFilter:[],
      filterFn: null
    },

   
    {
      width:'50px',
      name: 'Eliminar',
      sortOrder: null,
      sortDirections: [],
      sortFn: null,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
  ];



  value_criterio: any
  value_subcriterio: any
  value_indicador: any
  listCriterio: any[] = []
  listCriterio$!: Observable<any[]>;
  listAllCriterio$!: Observable<any[]>;

  tipoMatriz: number = 0
  listSubCriterio: any[] = []
  listIndicador: any[] = []
  objCriterio: any
  objSubCriterio: any
  objIndocador: any
  sub: any
  subCriterio: any
  listAllCriterio: any[] = []
  loadinCrear: boolean = false
  verificador: boolean = false


  constructor(private fb: UntypedFormBuilder, 
    private router: Router,
    private msg: NzMessageService,
    private serviceFirebase: LoginLogautService){

    this.matriz = [
      {
        title: 'titulo1',
        key: '0',
        expanded: true,
        isLeaf: false,
        children: [
          {
            title: 'tirulo 2',
            key: '1',
            expanded: false,
            children: [
              {
                title: 'unooooo',
                key: '3',
                isLeaf: true,
                children: []
              },
              {
                title: 'dossss',
                key: '4',
                isLeaf: true
                
              }
            ]
          }
        ]
      }
    ]


  }


  ngOnInit(): void {

    this.obtenerTodosCriterios()

    this.datoMatrizForm = this.fb.group({
      criterio: [null, [Validators.required]],
      subcriterio: [null, [Validators.required]]      
    });
  }



  crearCriterio(){

    const id = Math.random().toString(36).substring(2);
    this.loadinCrear = true

    if(this.tipoMatriz == 1){ //Criterio
      
      let matriz: dataMatriz = {

        criterio_descripcion: this.value_criterio,
        codigo_matriz: id,
        codigo_criterio: id,
        subcriterio: [],
        indicador: []      
      }
  
  
      this.serviceFirebase.crearDocumentoMatriz(matriz).then(resp =>{
  
        this.msg.success('CRITERIO CREADO CORRECTAMNETE')
        this.obtenerTodosCriterios()
        this.modalMatriz = false
        this.loadinCrear = false
        
      }).catch(err =>{
        this.msg.error('ERROR AL CREAR CRITERIO '+err.mensaje)
        this.loadinCrear = false
      })
  
    }

    if(this.tipoMatriz == 2){ // Sub Criterio

      this.loadinCrear = true
      this.agregarSubcriterio()

    }

    if(this.tipoMatriz == 3){ // Indicador
      this.loadinCrear = true
      this.agregarIndicador()
    }




  }

  obtenerTodosCriterios(){

    this.listCriterio = []
    this.listSubCriterio = []
    this.listIndicador = []
    this.cargandoMatriz = true
    this.listCriterio$ = this.serviceFirebase.getAllCriterios()

    this.sub = this.listCriterio$.subscribe({
      next: (data =>{
       
        this.listCriterio = data

        if(this.listCriterio.length>0){

        
          this.listCriterio.forEach((item: any)=>{
            if(item.subcriterio.length > 0){
              item.subcriterio.forEach((subcri: any)=>{
                let objetoSubcriterio = {
                  codigo_criterio: item.codigo_criterio,
                  codigo_matriz: item.codigo_matriz,
                  criterio_descripcion: item.criterio_descripcion,
                  subcriterio_descripcion: subcri.subcriterio_descripcion,
                  codigo_subcriterio: subcri.codigo_subcriterio,
                  subcriterio: item.subcriterio,
                  indicador: item.indicador
                }
    
                this.listSubCriterio = [... this.listSubCriterio, objetoSubcriterio]
    
              })
            }

            if(item.indicador.length > 0){
              item.indicador.forEach((indica: any)=>{


                const resultado = item.subcriterio.find( (cod: { codigo_subcriterio: any; }) => cod.codigo_subcriterio === indica.codigo_subcriterio );


                let objetoIndicador = {
                  codigo_indicador: indica.codigo_indicador,
                  criterio_descripcion: item.criterio_descripcion,
                  subcriterio_descripcion: resultado.subcriterio_descripcion,
                  indicador_descripcion: indica.indicador_descripcion,
                 
                }
    
                this.listIndicador = [... this.listIndicador, objetoIndicador]
    
              })
            }

           
          })
    
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

  openModalCriterio(){
    this.tipoMatriz = 1
    this.modalMatriz = true
    this.tituloMatriz = 'CREAR NUEVO CRITERIO'
  }


  openModalSubcriterio(criterio: any){
    this.tipoMatriz = 2
    this.modalMatriz = true
    this.tituloMatriz = 'CREAR NUEVO SUB CRITERIO'
    this.objCriterio = criterio
  }

  openModalIndicador(subcriterio: any){

    this.tipoMatriz = 3
    this.modalMatriz = true
    this.tituloMatriz = 'CREAR NUEVO INDICADOR'
    this.objSubCriterio = subcriterio

  }

  agregarSubcriterio(){

    const id = Math.random().toString(36).substring(2);
   
    let objSubcriterio: dataSubcriterio = {
      subcriterio_descripcion: this.value_subcriterio,
      codigo_criterio: this.objCriterio.codigo_criterio,
      codigo_subcriterio: id
    }

    let matriz: dataMatriz = {

      criterio_descripcion: this.objCriterio.criterio_descripcion,
      codigo_matriz: this.objCriterio.codigo_matriz,
      codigo_criterio: this.objCriterio.codigo_criterio,
      subcriterio: this.objCriterio.subcriterio,
      indicador: []      
    }

    matriz.subcriterio.push(objSubcriterio)


    this.serviceFirebase.updateCriterio(matriz).then(resp =>{

      this.msg.success('SUB CRITERIO CREADO CORRECTAMNETE')
      this.obtenerTodosCriterios()
      this.modalMatriz = false
      this.loadinCrear = false
      
    }).catch(err =>{
      this.msg.error('ERROR AL CREAR SUB CRITERIO '+err.mensaje)
      this.loadinCrear = false
    })
  }


  agregarIndicador(){

    const id = Math.random().toString(36).substring(2);

   
    let objIndocador: dataIndicador = {
      indicador_descripcion: this.value_indicador,
      codigo_criterio: this.objSubCriterio.codigo_criterio,
      codigo_subcriterio: this.objSubCriterio.codigo_subcriterio,
      codigo_indicador: id,
      acceso: 0
    }

    let matriz: dataMatriz = {

      criterio_descripcion: this.objSubCriterio.criterio_descripcion,
      codigo_matriz: this.objSubCriterio.codigo_matriz,
      codigo_criterio: this.objSubCriterio.codigo_criterio,
      subcriterio: this.objSubCriterio.subcriterio,
      indicador: this.objSubCriterio.indicador      
    }


    matriz.indicador.push(objIndocador)


    this.serviceFirebase.updateCriterio(matriz).then(resp =>{

      this.msg.success('INDICADOR CREADO CORRECTAMNETE')
      this.obtenerTodosCriterios()
      this.modalMatriz = false
      this.loadinCrear = false
      
    }).catch(err =>{
      this.msg.error('ERROR AL CREAR INDICADOR '+err.mensaje)
      this.loadinCrear = false
    })


  }

  cancel(){
    this.msg.info('OPERACIÓN CANCELADA')
  }

  eliminarCriterio(criterio: any){

    this.verificador = false

    this.getAllCriterios(1, criterio) 
    
    setTimeout(() => {

      if(this.verificador){
        this.serviceFirebase.deleteCriterio(criterio.codigo_matriz).then((res)=>{

          this.msg.success('CRITERIO ELIMINADO CORRECTAMENTE!')
          this.obtenerTodosCriterios()
    
        }).catch((error)=>{
          console.log('ERROR AL ELIMINAR CRITERIO '+error.message)
        })
    
      }
     
    }, 2000);


  }


  eliminarSubCriterio(subcriterio: any){

    this.verificador = false
    this.getAllCriterios(2, subcriterio)    

    
  }

  eliminarIndicador(indicador: any){

    this.verificador = false
    this.getAllCriterios(3, indicador)    


  }

  getAllCriterios(tipo: number, objEliminar: any){

    this.listAllCriterio$ = this.serviceFirebase.getAllCriterios()

    this.sub = this.listCriterio$.subscribe({
      next: (data =>{
      
        console.log('lista criterio')
        this.listAllCriterio = data
        console.log(this.listAllCriterio)

        if(this.listAllCriterio.length>0){
          if(tipo == 3){
            this.listAllCriterio.forEach((criterio: any)=>{
              criterio.indicador.forEach((dato: any, index: number)=>{
                if(dato.codigo_indicador === objEliminar.codigo_indicador){

                  this.eliminarAccesoUsuario(criterio.indicador)
                  

                  setTimeout(() => {

                    criterio.indicador.splice(index, 1)

                    let matriz: dataMatriz = {
  
                      criterio_descripcion: criterio.criterio_descripcion,
                      codigo_matriz: criterio.codigo_matriz,
                      codigo_criterio: criterio.codigo_criterio,
                      subcriterio: criterio.subcriterio,
                      indicador: criterio.indicador      
                    }

                    if(this.verificador){

                      this.serviceFirebase.updateCriterio(matriz).then(resp =>{

                        this.msg.success('INDICADOR ELIMINADO CORRECTAMENTE')
                        this.obtenerTodosCriterios()
                       
                  
                        
                      }).catch(err =>{
                        this.msg.error('ERROR AL ELIMINAR INDOCADOR '+err.mensaje)
                      })
    
                      
                    }
                   
                  }, 3000);
      
                }
              })
            })
          }
          if(tipo == 2){

            this.listAllCriterio.forEach((criterio: any)=>{
              criterio.subcriterio.forEach((dato: any, index: number)=>{
                if(dato.codigo_subcriterio === objEliminar.codigo_subcriterio){

                  
                  criterio.indicador.forEach((ind: any, idx: number)=>{
                    if(ind.codigo_subcriterio === dato.codigo_subcriterio){


                      this.eliminarAccesoUsuario(criterio.indicador)
                  

                      setTimeout(() => {

                      
                        criterio.indicador.splice(idx, 1)
      
                        let matriz: dataMatriz = {
      
                          criterio_descripcion: criterio.criterio_descripcion,
                          codigo_matriz: criterio.codigo_matriz,
                          codigo_criterio: criterio.codigo_criterio,
                          subcriterio: criterio.subcriterio,
                          indicador: criterio.indicador      
                        }
      
                        this.serviceFirebase.updateCriterio(matriz).then(resp =>{
      
                        
                          
                        }).catch(err =>{
                          this.msg.error('ERROR AL ELIMINAR INDOCADOR '+err.mensaje)
                          
                        })
                      }, 2000);
          
    
                    }
                  })

                  setTimeout(() => {

                    if(this.verificador){


                      criterio.subcriterio.splice(index, 1)
  
                      let matriz: dataMatriz = {
    
                        criterio_descripcion: criterio.criterio_descripcion,
                        codigo_matriz: criterio.codigo_matriz,
                        codigo_criterio: criterio.codigo_criterio,
                        subcriterio: criterio.subcriterio,
                        indicador: criterio.indicador      
                      }
    
                      this.serviceFirebase.updateCriterio(matriz).then(resp =>{
    
                        this.msg.success('ITEM SUBCRITERIO ELIMINADO')
                        this.obtenerTodosCriterios()
                        
                             
                        
                      }).catch(err =>{
                        this.msg.error('ERROR AL ELIMINAR SUBCRITERIO '+err.mensaje)
                      })
          
    
  
                    }
  

                  }, 5000);

            
                  

                }
              })
            })

          }
          if(tipo == 1){

            this.listAllCriterio.forEach(async(criterio: any)=>{

              if(criterio.codigo_criterio === objEliminar.codigo_criterio){

                this.eliminarAccesoUsuario(criterio.indicador)
                
              }

            })
          }
        }

      }),
      error: (err =>{
        this.msg.error('ERROR AL INTENTAR RECUPERAR DATOS DE CRITERIO')
      })
    })

  }



  eliminarAccesoUsuario(lstIndicador: any[]){

  
    this.serviceFirebase.getAllUsuario().subscribe({
      next: (data: any) =>{
       
        this.verificador = true
        if(data){
          data.forEach((usr: any)=>{
            if(usr.listaAccesos.length>0){

              this.actualizaUsuarioAcceso(0,lstIndicador, usr)

            }
          })
        
        }


      },
      error: (err =>{
        this.msg.error('NO SE PUEDE RECUPERAR LOS USUARIOS '+err.message)
        this.verificador = false
      })
    })



  }

  
  actualizaUsuarioAcceso(aux: number, lstIndicador: any[], usr: any){

    console.log(aux)
    console.log(lstIndicador)
    console.log(usr)
    
   
    if (aux < lstIndicador.length){
      
      usr.listaAccesos.forEach((acceso: any, index: number)=>{


        if(acceso.codigo_indicador == lstIndicador[aux].codigo_indicador){

       
          usr.listaAccesos.splice(index, 1)

          let objUsuario: dataUsuario = {

            email: usr.email,
            nombre: usr.nombre,
            apellido: usr.apellido,
            telefono: usr.telefono,
            id: usr.id,
            tipo: usr.tipo,
            listaAccesos: usr.listaAccesos,
            listaMensajes: usr.listaMensajes
  
          }

         
          this.serviceFirebase.updateUsuario(objUsuario).then(resp =>{
            
            this.verificador = true
            
          }).catch(err =>{
            this.msg.error('ERROR AL QUITAR ACCESO USUARIO '+err.mensaje)
            this.verificador = false
          })
  
  

        }
      })

      aux = aux + 1
      this.actualizaUsuarioAcceso(aux,lstIndicador,usr)
      

    }

  }


}
