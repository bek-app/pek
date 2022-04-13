import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AirSourceModel } from '@models/air-source.model';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AirSourceService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  airSourceSubject = new Subject();
  getAirSourceById(id: number): Observable<AirSourceModel[]> {
    return this.http.get<AirSourceModel[]>('api/AirSource?id=' + id);
  }
  getAirSourceList(airAreaId: number): Observable<AirSourceModel[]> {
    return this.http.get<AirSourceModel[]>(
      'api/AirSource/list?airAreaId=' + airAreaId
    );
  }
  addAirSource(data: AirSourceModel): Observable<AirSourceModel> {
    return this.http.put<AirSourceModel>(
      'api/AirSource',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAirSource(data: AirSourceModel): Observable<AirSourceModel> {
    return this.http.put<AirSourceModel>(
      'api/AirSource',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAirSource(id: number): Observable<AirSourceModel> {
    return this.http.delete<AirSourceModel>('api/AirSource?id=' + id);
  }
}
