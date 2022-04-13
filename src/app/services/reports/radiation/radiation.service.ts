import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RadiationModel } from '@models/reports/radiation/radiation.model';
@Injectable({
  providedIn: 'root',
})
export class RadiationService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getRadiationById(id: number): Observable<RadiationModel> {
    return this.http
      .get<RadiationModel>('api/Radiation?id=' + id)
      .pipe(map((data: any) => data));
  }

  getRadiationList(reportId: number): Observable<RadiationModel[]> {
    return this.http
      .get<RadiationModel[]>('api/Radiation/list?reportId=' + reportId)
      .pipe(map((data: any) => data));
  }

  addOrUpdateRadiation(data: RadiationModel): Observable<RadiationModel> {
    return this.http.put<RadiationModel>(
      'api/Radiation',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteRadiation(id: number): Observable<RadiationModel> {
    return this.http.delete<RadiationModel>('api/Radiation?id=' + id);
  }
}
