import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DicPollutantsService {
  subject = new Subject();
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8 ' })
  };

  constructor(private http: HttpClient) {
  }

  getDicPollutantsList(value: any): Observable<any[]> {
    return this.http.get<any[]>(`api/DicPollutant?name=${value}`);
  }


}
