import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '@models/dictionary/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicCalculationMethodService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getDicCalculationMethodLists(): Observable<Dictionary[]> {
    return this.http
      .get<Dictionary[]>('api/DicCalculationMethod')
      .pipe(map((response) => response));
  }

  addDicCalculationMethod(data: Dictionary): Observable<Dictionary> {
    return this.http.put<Dictionary>(
      'api/DicCalculationMethod',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
