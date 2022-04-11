import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceivingWasteOperationModel } from '@models/receiving-waste-operation.model';
  import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceivingWasteOperationService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getReceivingWasteOperationById(
    id: number
  ): Observable<ReceivingWasteOperationModel[]> {
    return this.http.get<ReceivingWasteOperationModel[]>(
      'api/ReceivingWasteOperation?id=' + id
    );
  }
  getReceivingWasteOperationListById(
    receivingWasteId: number
  ): Observable<ReceivingWasteOperationModel[]> {
    return this.http.get<ReceivingWasteOperationModel[]>(
      'api/ReceivingWasteOperation/list?reportId=' + receivingWasteId
    );
  }
  addReceivingWasteOperation(
    data: ReceivingWasteOperationModel
  ): Observable<ReceivingWasteOperationModel> {
    return this.http.put<ReceivingWasteOperationModel>(
      'api/ReceivingWasteOperation',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateReceivingWasteOperation(
    data: ReceivingWasteOperationModel
  ): Observable<ReceivingWasteOperationModel> {
    return this.http.put<ReceivingWasteOperationModel>(
      'api/ReceivingWasteOperation',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteReceivingWasteOperation(
    id: number
  ): Observable<ReceivingWasteOperationModel> {
    return this.http.delete<ReceivingWasteOperationModel>(
      'api/ReceivingWasteOperation?id=' + id,
      this.httpOptions
    );
  }
}
