import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WastePlaceStorageModel } from '@models/waste-place-storage.model';
@Injectable({
  providedIn: 'root',
})
export class WastePlaceStorageService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getWastePlaceStorageByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(
      'api/WastePlaceStorage/getByReport?reportId=' + reportId
    );
  }
  getWastePlaceStorageById(id: number): Observable<WastePlaceStorageModel[]> {
    return this.http.get<WastePlaceStorageModel[]>(
      'api/WastePlaceStorage?id=' + id
    );
  }
  getWastePlaceStorageListById(
    id: number
  ): Observable<WastePlaceStorageModel[]> {
    return this.http.get<WastePlaceStorageModel[]>(
      'api/WastePlaceStorage/list?objectId=' + id
    );
  }

  addWastePlaceStorage(
    data: WastePlaceStorageModel
  ): Observable<WastePlaceStorageModel> {
    return this.http.put<WastePlaceStorageModel>(
      'api/WastePlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateWastePlaceStorage(
    data: WastePlaceStorageModel
  ): Observable<WastePlaceStorageModel> {
    return this.http.put<WastePlaceStorageModel>(
      'api/WastePlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteWastePlaceStorage(id: number): Observable<WastePlaceStorageModel> {
    return this.http.delete<WastePlaceStorageModel>(
      'api/WastePlaceStorage?id=' + id
    );
  }
}
