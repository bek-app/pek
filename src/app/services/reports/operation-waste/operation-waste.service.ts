import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { OperationWasteModel } from '@models/operation-waste.model';

@Injectable({
  providedIn: 'root',
})
export class OperationWasteService {
  constructor(private http: HttpClient) {}
  operationWasteSenderRefresh = new Subject();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getOperationWasteById(id: number): Observable<OperationWasteModel[]> {
    return this.http.get<OperationWasteModel[]>('api/OperationWaste?id=' + id);
  }
  getOperationWasteListById(id: number): Observable<OperationWasteModel[]> {
    return this.http.get<OperationWasteModel[]>(
      'api/OperationWaste/list?reportId=' + id
    );
  }

  addOperationWaste(
    data: OperationWasteModel
  ): Observable<OperationWasteModel> {
    return this.http.put<OperationWasteModel>(
      'api/OperationWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateOperationWaste(
    data: OperationWasteModel
  ): Observable<OperationWasteModel> {
    return this.http.put<OperationWasteModel>(
      'api/OperationWaste',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteOperationWaste(id: number): Observable<OperationWasteModel> {
    return this.http.delete<OperationWasteModel>('api/OperationWaste?id=' + id);
  }
}
