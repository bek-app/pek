import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceivingWasteSenderModel } from '@models/receiving-waste-sender.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceivingWasteSenderService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getReceivingWasteSenderById(
    id: number
  ): Observable<ReceivingWasteSenderModel[]> {
    return this.http.get<ReceivingWasteSenderModel[]>(
      'api/ReceivingWasteSender?id=' + id
    );
  }
  getReceivingWasteSenderListById(
    id: number
  ): Observable<ReceivingWasteSenderModel[]> {
    return this.http.get<ReceivingWasteSenderModel[]>(
      'api/ReceivingWasteSender/list?reportId=' + id
    );
  }
  addReceivingWasteSender(
    data: ReceivingWasteSenderModel
  ): Observable<ReceivingWasteSenderModel> {
    return this.http.put<ReceivingWasteSenderModel>(
      'api/ReceivingWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateReceivingWasteSender(
    data: ReceivingWasteSenderModel
  ): Observable<ReceivingWasteSenderModel> {
    return this.http.put<ReceivingWasteSenderModel>(
      'api/ReceivingWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteReceivingWasteSender(
    id: number
  ): Observable<ReceivingWasteSenderModel> {
    return this.http.delete<ReceivingWasteSenderModel>(
      'api/ReceivingWasteSender?id=' + id,
      this.httpOptions
    );
  }
}
