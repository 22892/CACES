import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoginLogautService } from '../../access-data/service/login-logaut.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  array = [
    {img:'../../../assets/fondo1.jpg'},
  ];

  validateForm!: UntypedFormGroup;
  registerForm!: UntypedFormGroup;

  cargando: boolean = false;

  isVisiblePassword: boolean = false
  isLoadingContasena: boolean = false
  typeFormRecover: number = 0

  tipoIngreso: number = 0

  constructor(private fb: UntypedFormBuilder, 
    private router: Router,
    private notification: NzNotificationService, 
    private msg: NzMessageService,
    private loginService: LoginLogautService
   ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      passwordUser: [null, [Validators.required]]      
    });

    this.registerForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      
    });

  }


  submitForm(){
    
    this.tipoIngreso = 2
   
  }

  registrarse(){

    /*this.loginService.guardarUsuario(this.registerForm).subscribe({
      next: (data) =>{
        console.log(data)
        
        setTimeout(() => {
          location.reload();
          this.msg.success('USUARIO GUARDADO')
        }, 500);
  
    
      },
      error: (err) =>{
        this.msg.error('ERROR AL GUARDAR USUARIO '+err.mensaje)
      }
    })*/

    this.loginService.register(this.registerForm.value).then(response =>{

      this.msg.info('USUARIO REGISTRADO CORRECTAMENTE')

      const id = response.user.uid

      let usuario = {
        nombre: this.registerForm.get('name')!.value,
        apelliado: this.registerForm.get('lastname')!.value,
        telefono: this.registerForm.get('phone')!.value,
        id: id,

      }

      this.loginService.crearDocumentoUsuario(usuario).then(resp =>{

        setTimeout(() => {
          location.reload();
          this.msg.success('USUARIO GUARDADO')
        }, 500);

      }).catch(err =>{
        this.msg.error('ERROR AL GUARDAR USUARIO '+err.mensaje)
      })


    }).catch(error =>{
      console.log(error.code)
      this.msg.error('HA OCURRIDO UN ERROR '+error.message)
     
    })




  }

  loginIn(){

    this.loginService.login(this.validateForm.value).then(response =>{

      this.router.navigate(['/multimedia'])

      this.loginService.obtenerDatosUsuario(response.user.uid).then(async res =>{

        localStorage.setItem('usuario', JSON.stringify(await res.data()));
        this.loginService.updateLogaut.next(true);
       
      }).catch(err =>{
        this.msg.error('NO SE PUDO OBTENR DATOS USUARIO '+err.mensaje)
      })

    }).catch(error =>{
      if(error.code === 'auth/user-not-found'){
        this.msg.error('NO EXISTE EL USUARIO')
      }else if(error.code === 'auth/wrong-password'){
        this.msg.error('CONTRASEÑA INCORRECTA')
      }
    
    })

  }  

  loginGoogle(){
   console.log('goole') 
  }

  createNotification(type: string, titulo:string,mensaje:string): void {
    this.notification.create(
      type,
      titulo,
      mensaje,
      { nzPlacement: 'bottomLeft' }
    );
  }

  irRegistro(){
    this.tipoIngreso = 1
  }

  regresar(){
    this.tipoIngreso = 0
  }




}
