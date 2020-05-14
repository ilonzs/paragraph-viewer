import { TestBed } from '@angular/core/testing';

import { DocumentService } from './document.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('DocumentService', () => {
  let service: DocumentService;

  let fakeHttpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    fakeHttpClient = TestBed.inject(HttpClient);
    service = new DocumentService(fakeHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
