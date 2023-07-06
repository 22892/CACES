import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
signOut } from '@angular/fire/auth'
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Firestore, collectionData, docData  } from '@angular/fire/firestore'
import { CollectionReference, DocumentData, collection, addDoc, doc, setDoc, getDoc } from '@firebase/firestore'
import * as data from '../../../assets/matriz.json';

@Injectable({
  providedIn: 'root'
})

export class LoginLogautService {

  private usuarioCollection!: CollectionReference<DocumentData>;

  public updateLogaut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private menus: any[] = [];
  private menus$!: BehaviorSubject<any>;



  constructor(private auth: Auth,  private http: HttpClient, private firestore: Firestore) {
        
    this.usuarioCollection = collection(this.firestore, 'Usuarios')
    this.menus$ = new BehaviorSubject({menus:[],cargando:false});
  }


  register({ email, password}: any){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login({userName, passwordUser}: any){
    return signInWithEmailAndPassword(this.auth, userName, passwordUser)
  }


  logaut(){
    return signOut(this.auth)
  }

  guardarUsuario(usuario: any){
    return this.http.put('https://caces-web-default-rtdb.firebaseio.com/usuario.json', usuario.value)
  }


  crearDocumentoUsuario(usuario: any){
   

    const ref = collection(this.firestore, "Usuarios")
    return setDoc(doc(ref, usuario.id),usuario)

  }

  estadoAutenticacion(){
   // return onAuthStateChanged(this.auth,)
  }

  obtenerDatosUsuario(uid: any){

    const refId = doc(this.firestore, "Usuarios",uid)
    return getDoc(refId)
  }

  getDatosMatriz(): Observable<any>{

    this.menus = [];
    this.menus$.next({ menus: this.menus, cargando: true });

    this.http.get("assets/matriz.json").subscribe({
      next: (data =>{
        this.menus$.next({ menus: data, cargando: false});
      }),
      error: (err =>{
        this.menus$.next({ menus: [], cargando: false });
      })
    });

    return this.menus$.asObservable();
  }


  // STORAGE 

  

}
