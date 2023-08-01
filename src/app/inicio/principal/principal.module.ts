import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'src/app/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';


import { MatListModule} from '@angular/material/list'
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatToolbarModule} from '@angular/material/toolbar'
import { MatMenuModule} from '@angular/material/menu'
import { MatDividerModule} from '@angular/material/divider'
import { MatIconModule} from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule  } from '@angular/material/grid-list'


import { PrincipalComponent } from './principal.component';
import { SidebarComponent } from '../sidebar/sidebar.component'

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { GestionGuard } from 'src/app/guards/gestion.guard';
import { AccesoGuard } from 'src/app/guards/acceso.guard';

const routes: Routes = [
  {path:'', component: PrincipalComponent, ...canActivate(() => redirectUnauthorizedTo(['/'])), children:[

    {path:'multimedia',loadChildren:() => import('../../modulos/multimedia/multimedia.module').then(m => m.MultimediaModule), canActivate: [AccesoGuard]},
    {path:'gestion',loadChildren:() => import('../../modulos/gestion/gestion.module').then(m => m.GestionModule), canActivate: [GestionGuard]},
    
  ]},

];



@NgModule({
  declarations: [PrincipalComponent, SidebarComponent],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatGridListModule,
  ],
  
})
export class PrincipalModule { }
