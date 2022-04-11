import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceivingWasteAfterOperationModel } from '@models/receiving-waste-after-operation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceivingWasteAfterOperationService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getReceivingWasteAfterOperationById(
    id: number
  ): Observable<ReceivingWasteAfterOperationModel[]> {
    return this.http.get<ReceivingWasteAfterOperationModel[]>(
      'api/ReceivingWasteAfterOperation?id=' + id
    );
  }
  getReceivingWasteAfterOperationListById(
    receivingWasteId: number
  ): Observable<ReceivingWasteAfterOperationModel[]> {
    return this.http.get<ReceivingWasteAfterOperationModel[]>(
      'api/ReceivingWasteAfterOperation/list?reportId=' + receivingWasteId
    );
  }
  addReceivingWasteAfterOperation(
    data: ReceivingWasteAfterOperationModel
  ): Observable<ReceivingWasteAfterOperationModel> {
    return this.http.put<ReceivingWasteAfterOperationModel>(
      'api/ReceivingWasteAfterOperation',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateReceivingWasteAfterOperation(
    data: ReceivingWasteAfterOperationModel
  ): Observable<ReceivingWasteAfterOperationModel> {
    return this.http.put<ReceivingWasteAfterOperationModel>(
      'api/ReceivingWasteAfterOperation',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteReceivingWasteAfterOperation(
    id: number
  ): Observable<ReceivingWasteAfterOperationModel> {
    return this.http.delete<ReceivingWasteAfterOperationModel>(
      'api/ReceivingWasteAfterOperation?id=' + id,
      this.httpOptions
    );
  }
}
