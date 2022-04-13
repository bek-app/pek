import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AirAreaModel } from '@models/reports/air/air-area.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirAreaService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  airAreaSubject = new Subject();
  airSourceInitial = new Subject();
  getAirAreaById(id: number): Observable<AirAreaModel[]> {
    return this.http.get<AirAreaModel[]>('api/AirArea?id=' + id);
  }
  getAirAreaList(reportId: number): Observable<AirAreaModel[]> {
    return this.http.get<AirAreaModel[]>(
      'api/AirArea/list?reportId=' + reportId
    );
  }
  addAirArea(data: AirAreaModel): Observable<AirAreaModel> {
    return this.http.put<AirAreaModel>(
      'api/AirArea',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAirArea(data: AirAreaModel): Observable<AirAreaModel> {
    return this.http.put<AirAreaModel>(
      'api/AirArea',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAirArea(id: number): Observable<AirAreaModel> {
    return this.http.delete<AirAreaModel>('api/AirArea?id=' + id);
  }
}
