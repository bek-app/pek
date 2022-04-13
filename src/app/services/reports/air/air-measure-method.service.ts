import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AirMeasureMethodModel } from '@models/air-measure-method.model';

@Injectable({
  providedIn: 'root',
})
export class AirMeasureMethodService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getAirMeasureMethodLists(
    reportId: number,
    disc: string
  ): Observable<AirMeasureMethodModel[]> {
    return this.http
      .get<AirMeasureMethodModel[]>(
        `api/AirMeasureMethod/list?reportId=${reportId}&discriminator=${disc}`
      )
      .pipe(map((response) => response));
  }

  addAirMeasureMethod(data: any): Observable<any> {
    return this.http.put<any>(
      'api/AirMeasureMethod',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  addAirMeasureMethodMaterial(data: any): Observable<any> {
    return this.http.put<any>(
      'api/AirMeasureMethod/material',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
