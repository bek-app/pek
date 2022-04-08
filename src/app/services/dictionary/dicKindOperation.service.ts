import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DicKindOperationService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getDicKindOperation(): Observable<any> {
    return this.http
      .get<any>('api/DicKindOperation')
      .pipe(map((response) => response));
  }
  addDicKindOperation(data: any): Observable<any> {
    return this.http.put<any>(
      'api/DicKindOperation',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
