import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WasteOperationModel } from '@models/reports/receiving-waste/waste-operation.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WasteOperationService {
  private readonly apiUrl = 'api/ReceivingWasteOperation';
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getWasteOperationById(id: number): Observable<WasteOperationModel> {
    return this.http
      .get<WasteOperationModel>(`${this.apiUrl}?id=${id}`)
      .pipe(map((response) => response));
  }

  getWasteOperationListById(
    receivingWasteId: number
  ): Observable<WasteOperationModel[]> {
    return this.http.get<WasteOperationModel[]>(
      `${this.apiUrl}/list?reportId=${receivingWasteId}`
    );
  }

  addOrUpdateWasteOperation(
    data: WasteOperationModel
  ): Observable<WasteOperationModel> {
    return this.http.put<WasteOperationModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWasteOperation(id: number): Observable<WasteOperationModel> {
    return this.http.delete<WasteOperationModel>(
      `${this.apiUrl}?id=${id}`,
      this.httpOptions
    );
  }
}
