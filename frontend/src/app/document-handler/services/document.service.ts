import { Injectable } from '@angular/core';
import { Paragraph } from '../model/paragraph';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Route } from './route';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private _httpClient: HttpClient) { }

  getDocumentLength(): Promise<number> {
    return this._httpClient.get<number>(this.joinRoute(Route.DocumentApi, Route.GetDocumentLength)).toPromise();
  }

  getDocument(pageIndex: number, pageSize: number): Promise<Paragraph[]> {
    return this._httpClient.get<Paragraph[]>(this.joinRoute(Route.DocumentApi, Route.GetDocument),
      {
        params: new HttpParams({ fromObject: { offset: pageIndex.toString(), count: pageSize.toString() } })
      }).toPromise();
  }

  private joinRoute(base: string, args: string) {
    return base + '/' + args;
  }
}
