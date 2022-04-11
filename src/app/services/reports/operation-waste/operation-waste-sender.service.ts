import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperationWasteSenderModel } from '@models/reports/operation-waste/operation-waste.model';

@Injectable({
  providedIn: 'root',
})
export class OperationWasteSenderService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getOperationWasteSenderById(
    id: number
  ): Observable<OperationWasteSenderModel> {
    return this.http.get<OperationWasteSenderModel>(
      'api/OperationWasteSender?id=' + id
    );
  }

  getOperationWasteSenderListByReportId(
    id: number
  ): Observable<OperationWasteSenderModel[]> {
    return this.http.get<OperationWasteSenderModel[]>(
      'api/OperationWasteSender/list?reportId=' + id
    );
  }

  addOperationWasteSender(
    data: OperationWasteSenderModel
  ): Observable<OperationWasteSenderModel> {
    return this.http.put<OperationWasteSenderModel>(
      'api/OperationWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateOperationWasteSender(
    data: OperationWasteSenderModel
  ): Observable<OperationWasteSenderModel> {
    return this.http.put<OperationWasteSenderModel>(
      'api/OperationWasteSender',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteOperationWasteSender(
    id: number
  ): Observable<OperationWasteSenderModel> {
    return this.http.delete<OperationWasteSenderModel>(
      'api/OperationWasteSender?id=' + id
    );
  }
}
