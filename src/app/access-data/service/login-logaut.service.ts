import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
signOut, deleteUser } from '@angular/fire/auth'
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Firestore, collectionData, docData  } from '@angular/fire/firestore'
import { CollectionReference, DocumentData, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc } from '@firebase/firestore'
import * as data from '../../../assets/matriz.json';
import {Storage, ref, uploadBytes, getDownloadURL, listAll} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class LoginLogautService {

  private usuarioCollection!: CollectionReference<DocumentData>;
  private matrizCollection!: CollectionReference<DocumentData>;


  public eventoMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public eventoCodigoIndicador: BehaviorSubject<any> = new BehaviorSubject<any>('');

  public actualizarMensajes: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);


  private menus: any[] = [];
  private menus$!: BehaviorSubject<any>;

  private menusadmin: any[] = [];
  private menusadmin$!: BehaviorSubject<any>;

  variable: any
  tipo: any



  constructor(private auth: Auth,  private http: HttpClient, private firestore: Firestore, private storage: Storage) {
        
    this.usuarioCollection = collection(this.firestore, 'Usuarios')
    this.matrizCollection = collection(this.firestore, 'Matriz')

    this.menus$ = new BehaviorSubject({menus:[],cargando:false});
    this.menusadmin$ = new BehaviorSubject({menusadmin:[],cargando:false});


   

  }

  ejemplo(){
    let user = this.auth.currentUser

    

    return user
    
  }


  register({ email, password}: any){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login({userName, passwordUser}: any){
    return signInWithEmailAndPassword(this.auth, userName, passwordUser)
  }

  deleteUserAutentication(user: any){
    return deleteUser(user)
  }


  logaut(){
    return signOut(this.auth)
  }

  guardarUsuario(usuario: any){
    return this.http.put('https://caces-web-default-rtdb.firebaseio.com/usuario.json', usuario.value)
  }


  crearDocumentoUsuario(usuario: any){
   
    console.log('usaurooooo')
    console.log(usuario)

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

  getDatosMenuAdministrador(): Observable<any>{

    this.menusadmin = [];
    this.menusadmin$.next({ menusadmin: this.menusadmin, cargando: true });

    this.http.get("assets/menuGestion.json").subscribe({
      next: (data =>{
        this.menusadmin$.next({ menusadmin: data, cargando: false});
      }),
      error: (err =>{
        this.menusadmin$.next({ menusadmin: [], cargando: false });
      })
    });

    return this.menusadmin$.asObservable();
  }



  
  // SECCCION PARA GESTIONAR LA MATRIZ DEL MENU

  
  crearDocumentoMatriz(matriz: any){
   

    const ref = collection(this.firestore, "Matriz")
    return setDoc(doc(ref, matriz.codigo_criterio),matriz)

  }

  getAllCriterios() {
    return collectionData(this.matrizCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  updateCriterio(matriz: any) {
    const matrizDocumentReference = doc(
      this.firestore,
      `Matriz/${matriz.codigo_matriz}`
    );
    return updateDoc(matrizDocumentReference, { ...matriz });
  }

  
  deleteCriterio(id: any){
    const docRef = doc(this.firestore, 'Matriz', id)
    return deleteDoc(docRef)
  }

  


  // SECCCION PARA GESTIONAR USUARIOS



  getAllUsuario() {
    return collectionData(this.usuarioCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }


  updateUsuario(usuario: any) {
    console.log('veces que entra')
    console.log(usuario)
    const usuarioDocumentReference = doc(
      this.firestore,
      `Usuarios/${usuario.id}`
    );
    return updateDoc(usuarioDocumentReference, { ...usuario });
  }


  deleteUsuario(id: any){
    const docRef = doc(this.firestore, 'Usuarios', id)
    return deleteDoc(docRef)
  }


  // SECCION PARA GESTIONAR DOCUMENTOS / ARCHIVOS


  getAllDocumentos(usr: any, codigo_indicador: any, path: any){

    console.log('datos')
    
    let storageRef: any

    //const imgRef = ref(this.storage, `multimedia/${codigo_indicador}`)

    if(usr.tipo == '2'){

      const imgRef = ref(this.storage, path)
      storageRef = listAll(imgRef) 
      
  
    }

    if(usr.tipo == '3'){
      const imgRef = ref(this.storage, `multimedia/${codigo_indicador}/${usr.id}`)
      storageRef = listAll(imgRef) 
     
  
    }

    return storageRef  
    
  }


}
