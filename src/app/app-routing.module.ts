import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',loadChildren:() => import('./inicio/login/login.module').then(m => m.LoginModule)},
  {path:'login',loadChildren:() => import('./inicio/login/login.module').then(m => m.LoginModule)},
  {path:'',loadChildren:() => import('./inicio/principal/principal.module').then(m => m.PrincipalModule)},
 
]


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
