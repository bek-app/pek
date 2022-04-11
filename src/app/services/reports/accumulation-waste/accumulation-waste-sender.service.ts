import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AccumulationWasteSenderModel } from '@models/reports/accumulation-waste/accumulation-waste-sender.model';

@Injectable({
  providedIn: 'root',
})
export class AccumulationWasteSenderService {
  constructor(private http: HttpClient) {}
  subject = new Subject();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getAccumulationWasteSenderById(
    id: number
  ): Observable<AccumulationWasteSenderModel[]> {
    return this.http.get<AccumulationWasteSenderModel[]>(
      'api/AccumulationWasteSender?id=' + id
    );
  }

  getAccumulationWasteSenderListById(
    id: number
  ): Observable<AccumulationWasteSenderModel[]> {
    return this.http.get<AccumulationWasteSenderModel[]>(
      'api/AccumulationWasteSender/list?reportId=' + id
    );
  }

  getBinName(name: string): Observable<any[]> {
    return this.http.get<any[]>(
      'https://post.kz/mail-app/api/public/transfer/loadName/' + name
    );
  }

  addAccumulationWasteSender(
    data: AccumulationWasteSenderModel
  ): Observable<AccumulationWasteSenderModel> {
    return this.http.put<AccumulationWasteSenderModel>(
      'api/AccumulationWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAccumulationWasteSender(
    data: AccumulationWasteSenderModel
  ): Observable<AccumulationWasteSenderModel> {
    return this.http.put<AccumulationWasteSenderModel>(
      'api/AccumulationWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAccumulationWasteSender(
    id: number
  ): Observable<AccumulationWasteSenderModel> {
    return this.http.delete<AccumulationWasteSenderModel>(
      'api/AccumulationWasteSender?id=' + id
    );
  }
}
