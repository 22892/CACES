import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'src/app/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionComponent } from './gestion.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TareasComponent } from './componentes/tareas/tareas.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
  { path: '', component: GestionComponent, pathMatch: 'full' },  
  { path: 'tareas', component: TareasComponent },
  { path: 'usuarios', component: UsuariosComponent },
];



@NgModule({
  declarations: [GestionComponent, TareasComponent, UsuariosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    DragDropModule
   
  ]
})
export class GestionModule { }
