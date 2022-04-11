import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AccumulationWasteModel } from '@models/reports/accumulation-waste/accumulation-waste.model';

@Injectable({
  providedIn: 'root',
})
export class AccumulationWasteService {
  constructor(private http: HttpClient) {}

  accWasteSender = new Subject();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getAccumulationWasteById(id: number): Observable<AccumulationWasteModel> {
    return this.http.get<AccumulationWasteModel>(
      'api/AccumulationWaste?id=' + id
    );
  }

  getAccumulationWasteListByReportId(
    reportId: number
  ): Observable<AccumulationWasteModel[]> {
    return this.http.get<AccumulationWasteModel[]>(
      'api/AccumulationWaste/list?reportId=' + reportId
    );
  }

  addAccumulationWaste(
    data: AccumulationWasteModel
  ): Observable<AccumulationWasteModel> {
    return this.http.put<AccumulationWasteModel>(
      'api/AccumulationWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAccumulationWaste(
    data: AccumulationWasteModel
  ): Observable<AccumulationWasteModel> {
    return this.http.put<AccumulationWasteModel>(
      'api/AccumulationWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAccumulationWaste(id: number): Observable<AccumulationWasteModel> {
    return this.http.delete<AccumulationWasteModel>(
      'api/AccumulationWaste?id=' + id
    );
  }
}
