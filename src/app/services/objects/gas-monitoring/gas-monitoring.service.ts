import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GasMonitoringModel,
  GazMonitoringPointModel,
} from '@models/objects/gas-monitoring/gas-monitoring.model';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GasMonitoringService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  private readonly apiUrl = '/api/GazMonitoring';
  constructor(private http: HttpClient) {}

  getGasMonitoring(id: number): Observable<GasMonitoringModel> {
    return this.http
      .get<GasMonitoringModel>(`${this.apiUrl}?id=${id}`)
      .pipe(map((response) => response));
  }

  getGasMonitorings(objectId: number): Observable<GasMonitoringModel[]> {
    return this.http
      .get<GasMonitoringModel[]>(
        `${this.apiUrl}/montorings?objectId=${objectId}`
      )
      .pipe(map((response) => response));
  }

  addGasMonitoring(data: any): Observable<GasMonitoringModel> {
    return this.http.put<GasMonitoringModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateGasMonitoring(data: any): Observable<GasMonitoringModel> {
    return this.http.put<GasMonitoringModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteGasMonitoring(id: number): Observable<GasMonitoringModel> {
    return this.http.delete<GasMonitoringModel>(
      `${this.apiUrl}?id=${id}`,
      this.httpOptions
    );
  }

  ////////////////////////////////////////
  getGazMonitoringPoint(id: number): Observable<GazMonitoringPointModel> {
    return this.http.get<GazMonitoringPointModel>(
      `/api/GazMonitoringPoint?id=${id}`
    );
  }

  getGazMonitoringPoints(
    monitoringId: number
  ): Observable<GazMonitoringPointModel[]> {
    return this.http.get<GazMonitoringPointModel[]>(
      `/api/GazMonitoringPoint/points?monitoringId=${monitoringId}`
    );
  }

  addGazMonitoringPoint(data: any): Observable<GazMonitoringPointModel> {
    return this.http.put<GazMonitoringPointModel>(
      '/api/GazMonitoringPoint',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateGazMonitoringPoint(data: any): Observable<GazMonitoringPointModel> {
    return this.http.put<GazMonitoringPointModel>(
      '/api/GazMonitoringPoint',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteGazMonitoringPoint(id: number): Observable<GazMonitoringPointModel> {
    return this.http.delete<GazMonitoringPointModel>(
      '/api/GazMonitoringPoint?id=' + id,
      this.httpOptions
    );
  }
}
