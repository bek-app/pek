import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DicWasteService {


  constructor(private http: HttpClient) {
  }

  getDicWaste(): Observable<any> {
    return this.http.get<any>('api/DicWaste').pipe(map(response => response));

  }
}
