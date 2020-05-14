import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ParagraphCardComponent } from './components/paragraph-card/paragraph-card.component';



@NgModule({
  declarations: [ViewerComponent, ParagraphCardComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class DocumentHandlerModule { }
