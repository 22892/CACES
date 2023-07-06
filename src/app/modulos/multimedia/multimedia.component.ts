import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, throwError, Observer } from 'rxjs';
import {NzTableFilterFn,NzTableFilterList,NzTableSortFn,NzTableSortOrder,} from 'ng-zorro-antd/table';
import {Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';


@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css']
})
export class MultimediaComponent {

  fileList: NzUploadFile[] = [];
  file: any;
  picture: any = "";
  looggerUser: any
  usuario: any


  constructor(private router: Router,
              private msg: NzMessageService,
              private storage: Storage,) {

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
    this.usuario = JSON.parse(this.looggerUser)
    
    const imgRef = ref(this.storage, `multimedia/${this.usuario.id}/${this.file.name}`)
    uploadBytes(imgRef, this.file)
   
    getDownloadURL(imgRef).then(url =>{
      this.picture = url 
    }).catch(error =>{
      console.log(error);
      
      this.msg.error('ERROR AL SUBIR LA IMAGEN')
      this.picture = ''
      this.fileList = []
    })

  }


}
