import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WastePlaceModel } from '@models/objects/waste-place/waste-place.model';
@Injectable({
  providedIn: 'root',
})
export class WastePlaceService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getWastePlaceByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(
      'api/WastePlaceStorage/getByReport?reportId=' + reportId
    );
  }

  getWastePlace(id: number): Observable<WastePlaceModel> {
    return this.http.get<WastePlaceModel>('api/WastePlaceStorage?id=' + id);
  }

  getWastePlaceListByObjectId(id: number): Observable<WastePlaceModel[]> {
    return this.http.get<WastePlaceModel[]>(
      'api/WastePlaceStorage/list?objectId=' + id
    );
  }

  addWastePlace(data: WastePlaceModel): Observable<WastePlaceModel> {
    return this.http.put<WastePlaceModel>(
      'api/WastePlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateWastePlace(data: WastePlaceModel): Observable<WastePlaceModel> {
    return this.http.put<WastePlaceModel>(
      'api/WastePlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWastePlace(id: number): Observable<WastePlaceModel> {
    return this.http.delete<WastePlaceModel>('api/WastePlaceStorage?id=' + id);
  }
}
