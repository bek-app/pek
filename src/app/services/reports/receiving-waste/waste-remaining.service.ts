import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WasteRemainingModel } from '@models/reports/receiving-waste/waste-remaining.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WasteRemainingService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getWasteRemainingById(id: number): Observable<WasteRemainingModel> {
    return this.http.get<WasteRemainingModel>(
      'api/ReceivingWasteRemaining?id=' + id
    );
  }

  getWasteRemainingListById(
    receivingWasteId: number
  ): Observable<WasteRemainingModel[]> {
    return this.http.get<WasteRemainingModel[]>(
      'api/ReceivingWasteRemaining/list?reportId=' + receivingWasteId
    );
  }

  addOrUpdateWasteRemaining(
    data: WasteRemainingModel
  ): Observable<WasteRemainingModel> {
    return this.http.put<WasteRemainingModel>(
      'api/ReceivingWasteRemaining',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWasteRemaining(id: number): Observable<WasteRemainingModel> {
    return this.http.delete<WasteRemainingModel>(
      'api/ReceivingWasteRemaining?id=' + id,
      this.httpOptions
    );
  }
}
