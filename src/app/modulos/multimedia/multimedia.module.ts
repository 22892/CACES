import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "src/app/ng-zorro.module";
import { MultimediaComponent } from './multimedia.component';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MensajesComponent } from '../mensajes/mensajes.component';

import { MatListModule} from '@angular/material/list'
import { MatSidenavModule} from '@angular/material/sidenav'
import { MatToolbarModule} from '@angular/material/toolbar'
import { MatMenuModule} from '@angular/material/menu'
import { MatDividerModule} from '@angular/material/divider'
import { MatIconModule} from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule  } from '@angular/material/grid-list'

const routes: Routes = [
	{ path: "", component: MultimediaComponent },
  { path: 'mensajes', component: MensajesComponent}
];


@NgModule({
  declarations: [MultimediaComponent, MensajesComponent],
  imports: [
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

  ]
})
export class MultimediaModule { }
