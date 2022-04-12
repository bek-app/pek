import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReceivedWasteModel } from '@models/reports/receiving-waste/received-waste.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceivedWasteService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getReceivedWasteById(id: number): Observable<ReceivedWasteModel> {
    return this.http.get<ReceivedWasteModel>(
      'api/ReceivingWasteRecived?id=' + id
    );
  }

  getReceivedWasteListById(id: number): Observable<ReceivedWasteModel[]> {
    return this.http.get<ReceivedWasteModel[]>(
      'api/ReceivingWasteRecived/list?reportId=' + id
    );
  }

  addOrUpdateReceivedWaste(
    data: ReceivedWasteModel
  ): Observable<ReceivedWasteModel> {
    return this.http.put<ReceivedWasteModel>(
      'api/ReceivingWasteRecived',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteReceivedWaste(id: number): Observable<ReceivedWasteModel> {
    return this.http.delete<ReceivedWasteModel>(
      'api/ReceivingWasteRecived?id=' + id,
      this.httpOptions
    );
  }
}
