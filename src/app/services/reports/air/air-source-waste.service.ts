import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
import { AirSourceWasteModel } from '../models/air-source-waste.model';
@Injectable({
  providedIn: 'root'
})
export class AirSourceWasteService {

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getAirSourceWasteById(id: number): Observable<AirSourceWasteModel[]> {
    return this.http.get<AirSourceWasteModel[]>('api/AirSourceWaste?id=' + id);
  }
  getAirSourceWasteList(airSourceId: number): Observable<AirSourceWasteModel[]> {
    return this.http.get<AirSourceWasteModel[]>(
      'api/AirSourceWaste/list?airSourceId=' + airSourceId
    );
  }
  addAirSourceWaste(data: AirSourceWasteModel): Observable<AirSourceWasteModel> {
    return this.http.put<AirSourceWasteModel>(
      'api/AirSourceWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAirSourceWaste(data: AirSourceWasteModel): Observable<AirSourceWasteModel> {
    return this.http.put<AirSourceWasteModel>(
      'api/AirSourceWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAirSourceWaste(id: number): Observable<AirSourceWasteModel> {
    return this.http.delete<AirSourceWasteModel>('api/AirSourceWaste?id=' + id);
  }
}
