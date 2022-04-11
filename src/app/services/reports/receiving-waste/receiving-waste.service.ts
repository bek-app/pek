import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceivingWasteModel } from '@models/receiving-waste.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceivingWasteService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  refreshListWasteId = new Subject();
  getReceivingWasteById(id: number): Observable<ReceivingWasteModel[]> {
    return this.http.get<ReceivingWasteModel[]>('api/ReceivingWaste?id=' + id);
  }
  getReceivingWasteListByReportId(
    reportId: number
  ): Observable<ReceivingWasteModel[]> {
    return this.http.get<ReceivingWasteModel[]>(
      'api/ReceivingWaste/list?reportId=' + reportId
    );
  }
  addReceivingWaste(
    data: ReceivingWasteModel
  ): Observable<ReceivingWasteModel> {
    return this.http.put<ReceivingWasteModel>(
      'api/ReceivingWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateReceivingWaste(
    data: ReceivingWasteModel
  ): Observable<ReceivingWasteModel> {
    return this.http.put<ReceivingWasteModel>(
      'api/ReceivingWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteReceivingWaste(id: number): Observable<ReceivingWasteModel> {
    return this.http.delete<ReceivingWasteModel>(
      'api/ReceivingWaste?id=' + id,
      this.httpOptions
    );
  }
}
