import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TboGazMonitoringModel } from "@models/tbo-gaz-monitoring.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TboGazMonitoringService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8 ' })
  };

  getTboGazMonitoring(id: number): Observable<TboGazMonitoringModel[]> {
    return this.http.get<TboGazMonitoringModel[]>(`api/PekWasteWater?id=` + id).pipe(map(response => response));
  }
}
