import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, throwError, Observer } from 'rxjs';
import {NzTableFilterFn,NzTableFilterList,NzTableSortFn,NzTableSortOrder,} from 'ng-zorro-antd/table';
import {Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { LoginLogautService } from 'src/app/access-data/service/login-logaut.service';
import { NzButtonSize } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css']
})
export class MultimediaComponent {

  fileList: NzUploadFile[] = [];
  listFiles: any[] = []
  file: any;
  picture: any = "";
  looggerUser: any
  usuario: any
  indicador: any
  cod_indocador: any
  cargandoDoc: boolean = false
  activaContenido: boolean = false
  size: NzButtonSize = 'large';

  index: number = 0;
  tabs = [
    {
      name: 'GESTIÓN DOCUMENTOS',
      icon: 'menu'
    },
    
  ];



  constructor(private router: Router,
    private msg: NzMessageService,
    private storage: Storage,
    private loginService: LoginLogautService,) {


      this.loginService.eventoMenu.subscribe( value => {

        if(value){
          this.activaContenido = true
          console.log('activaaaaaaaaaaaaaaaaa')
          this.getListDocument()

        }else{
          this.activaContenido = false
        }

      })

          

  }


  beforeUpload = (file: any): boolean => {
    this.file = file
    if (this.fileList.length > 0) {
      this.msg.error('Solo puede Cargar un Archivo');
    } else {
      
      this.fileList = this.fileList.concat(file);
      this.subirFileUsuario()
    }

    return false;
  };


  subirFileUsuario(){

    this.looggerUser = localStorage.getItem('usuario')
    this.indicador = localStorage.getItem('indicador')
    this.usuario = JSON.parse(this.looggerUser)
    this.cod_indocador = JSON.parse(this.indicador)

    const imgRef = ref(this.storage, `multimedia/${this.cod_indocador.codigo_indicador}/${this.usuario.id}/${this.file.name}`)
    uploadBytes(imgRef, this.file)
   
    getDownloadURL(imgRef).then(url =>{

      this.getListDocument()
      
    }).catch(error =>{
      console.log(error);
      this.msg.error('ERROR, VUELVA A SUBIR EL DOCUMENTO')
      this.picture = ''
     
    })

  }

  getListDocument(){

    this.listFiles = []
    let path: any = 'multimedia/'
    let usr: any
    let indi: any
    this.looggerUser = localStorage.getItem('usuario')
    this.indicador = localStorage.getItem('indicador')
    usr = JSON.parse(this.looggerUser)
    indi = JSON.parse(this.indicador)

    
    this.cargandoDoc = true

    this.loginService.getAllDocumentos(usr, indi.codigo_indicador, path).then((res: any) =>{


      if(usr.tipo == '3'){
        if(res){
          
          res.items.forEach((doc: any)=>{
            console.log('avvvvvv')
            console.log(doc)

            let cad = doc._location.path_.split('/')
            let nombre = cad[cad.length-1]
            
            const imgRef = ref(this.storage, doc._location.path_)

            getDownloadURL(imgRef).then(url =>{

             
              let objListaDoc: any = {
                codigo_indicador: indi.codigo_indicador,
                path: doc._location.path_,
                nombre: nombre,
                url: url
              }
              this.listFiles = [... this.listFiles, objListaDoc]

              
            }).catch(error =>{
              this.msg.error('ERROR AL SUBIR LA IMAGEN')
             
            })
        

          })
          this.cargandoDoc = false

        }
      }

      if(usr.tipo == '2'){

        if(res){
          res.prefixes.forEach((indicadores: any) => {
        
            let auxPath = path+indi.codigo_indicador

         
            if(auxPath === indicadores._location.path){

              this.loginService.getAllDocumentos(usr,indi.codigo_indicador, indicadores._location.path).then((usuarios: any)=>{
              
                if(usuarios){
                  usuarios.prefixes.forEach((documentos: any)=>{

                    
                    this.loginService.getAllDocumentos(usr, indi.cod_indicador, documentos._location.path).then((img: any)=>{
                     
                      if(img){
                        img.items.forEach((doc: any)=>{

                          let cad = doc._location.path_.split('/')
                          let nombre = cad[cad.length-1]
                        
                          const imgRef = ref(this.storage, doc._location.path_)
              
                          getDownloadURL(imgRef).then(url =>{
              
                            
                            let objLista: any = {
                              codigo_indicador: indi.codigo_indicador,
                              path: doc._location.path_,
                              nombre: nombre,
                              url: url
                            }
                           
                            this.listFiles = [... this.listFiles, objLista]
  
                            
                          }).catch(error =>{
                            this.msg.error('ERROR AL SUBIR LA IMAGEN')
                           
                          })
              
                         
                         
                        })
    
                      }
                    
                    })
                  })
  
                }
              
              })
            }

          });
          this.cargandoDoc = false

        }

      }

      console.log('lista final files')
      console.log(this.listFiles)



    }).catch((err: any) =>{
      console.log(err)
    })
  }

  


}
