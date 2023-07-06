import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "src/app/ng-zorro.module";
import { MultimediaComponent } from './multimedia.component';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
	{ path: "", component: MultimediaComponent },
];


@NgModule({
  declarations: [MultimediaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class MultimediaModule { }
