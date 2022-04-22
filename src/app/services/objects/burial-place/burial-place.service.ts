import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BurialPlaceModel } from '@models/objects/burial-place/burial-place.model';
@Injectable({
  providedIn: 'root',
})
export class BurialPlaceService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getBurialPlaceByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(
      'api/BurialPlaceStorage/getByReport?reportId=' + reportId
    );
  }

  getBurialPlace(id: number): Observable<BurialPlaceModel> {
    return this.http.get<BurialPlaceModel>('api/BurialPlaceStorage?id=' + id);
  }

  getBurialPlaceList(id: number): Observable<BurialPlaceModel[]> {
    return this.http.get<BurialPlaceModel[]>(
      'api/BurialPlaceStorage/list?objectId=' + id
    );
  }

  addOrUpdateBurialPlace(data: BurialPlaceModel): Observable<BurialPlaceModel> {
    return this.http.put<BurialPlaceModel>(
      'api/BurialPlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }



  deleteBurialPlace(id: number): Observable<BurialPlaceModel> {
    return this.http.delete<BurialPlaceModel>(
      'api/BurialPlaceStorage?id=' + id
    );
  }
}
