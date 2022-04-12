import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WasteAfterOperationModel } from '@models/reports/receiving-waste/waste-after-operation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WasteAfterOperationService {
  private readonly apiUrl = 'api/ReceivingWasteAfterOperation';
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getWasteAfterOperationById(
    id: number
  ): Observable<WasteAfterOperationModel[]> {
    return this.http.get<WasteAfterOperationModel[]>(`${this.apiUrl}?id=${id}`);
  }

  getWasteAfterOperationListById(
    receivingWasteId: number
  ): Observable<WasteAfterOperationModel[]> {
    return this.http.get<WasteAfterOperationModel[]>(
      `${this.apiUrl}/list?reportId=${receivingWasteId}`
    );
  }

  addOrUpdateWasteAfterOperation(
    data: WasteAfterOperationModel
  ): Observable<WasteAfterOperationModel> {
    return this.http.put<WasteAfterOperationModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWasteAfterOperation(id: number): Observable<WasteAfterOperationModel> {
    return this.http.delete<WasteAfterOperationModel>(
      `${this.apiUrl}?id=${id}`,
      this.httpOptions
    );
  }
}
