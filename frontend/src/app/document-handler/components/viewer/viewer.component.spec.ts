import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule, MessageBarService } from 'src/app/material/material.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewerComponent } from './viewer.component';
import { DocumentService } from '../../services/document.service';
import { ParagraphCardComponent } from '../paragraph-card/paragraph-card.component';
import { Observable } from 'rxjs';

describe('ViewerComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerComponent, ParagraphCardComponent ],
      imports: [
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers: [DocumentService]
    })
    .compileComponents();
  }));

  beforeEach(() => {

  });

});
