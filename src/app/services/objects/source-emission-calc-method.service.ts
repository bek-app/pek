import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SourceEmissionCalcMethod } from '@models/source-emission-calcmethod.model';

@Injectable({
  providedIn: 'root',
})
export class SourceEmissionCalcMethodService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };


  constructor(private http: HttpClient) {}

  getCalcMethodLists(sourceId: number): Observable<SourceEmissionCalcMethod[]> {
    return this.http
      .get<SourceEmissionCalcMethod[]>(
        `api/SourceEmissionCalcMethod/list?sourceId=` + sourceId
      )
      .pipe(map((response) => response));
  }
  getCalcMethodById(id: number): Observable<SourceEmissionCalcMethod[]> {
    return this.http
      .get<SourceEmissionCalcMethod[]>(`api/SourceEmissionCalcMethod?id=` + id)
      .pipe(map((response) => response));
  }
  addCalcMethod(
    data: SourceEmissionCalcMethod
  ): Observable<SourceEmissionCalcMethod> {
    return this.http.put<SourceEmissionCalcMethod>(
      'api/SourceEmissionCalcMethod',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateCalcMethod(
    data: SourceEmissionCalcMethod
  ): Observable<SourceEmissionCalcMethod> {
    return this.http.put<SourceEmissionCalcMethod>(
      'api/SourceEmissionCalcMethod',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteCalcMethod(id: number): Observable<SourceEmissionCalcMethod> {
    return this.http.delete<SourceEmissionCalcMethod>(
      `api/SourceEmissionCalcMethod?id=${id}`,
      this.httpOptions
    );
  }
}
