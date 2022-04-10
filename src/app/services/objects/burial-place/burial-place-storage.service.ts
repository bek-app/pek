import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BurialPlaceStorageModel } from '@models/burial-place-storage.model';
 @Injectable({
  providedIn: 'root',
})
export class BurialPlaceStorageService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getBurialPlaceStorageByReportId(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(
      'api/BurialPlaceStorage/getByReport?reportId=' + reportId
    );
  }
  getBurialPlaceStorageById(id: number): Observable<BurialPlaceStorageModel[]> {
    return this.http.get<BurialPlaceStorageModel[]>(
      'api/BurialPlaceStorage?id=' + id
    );
  }
  getBurialPlaceStorageListById(
    id: number
  ): Observable<BurialPlaceStorageModel[]> {
    return this.http.get<BurialPlaceStorageModel[]>(
      'api/BurialPlaceStorage/list?objectId=' + id
    );
  }

  addBurialPlaceStorage(
    data: BurialPlaceStorageModel
  ): Observable<BurialPlaceStorageModel> {
    return this.http.put<BurialPlaceStorageModel>(
      'api/BurialPlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateBurialPlaceStorage(
    data: BurialPlaceStorageModel
  ): Observable<BurialPlaceStorageModel> {
    return this.http.put<BurialPlaceStorageModel>(
      'api/BurialPlaceStorage',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteBurialPlaceStorage(id: number): Observable<BurialPlaceStorageModel> {
    return this.http.delete<BurialPlaceStorageModel>(
      'api/BurialPlaceStorage?id=' + id
    );
  }
}
