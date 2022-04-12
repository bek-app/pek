import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WasteSenderModel } from '@models/reports/receiving-waste/waste-sender.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WasteSenderService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'api/ReceivingWasteSender';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getWasteSenderById(id: number): Observable<WasteSenderModel> {
    return this.http
      .get<WasteSenderModel>(`${this.apiUrl}?id=${id}`)
      .pipe(map((res) => res));
  }

  getWasteSenderListById(id: number): Observable<WasteSenderModel[]> {
    return this.http
      .get<WasteSenderModel[]>(`${this.apiUrl}/list?reportId=${id}`)
      .pipe(map((res) => res));
  }

  addOrUpdateWasteSender(data: WasteSenderModel): Observable<WasteSenderModel> {
    return this.http.put<WasteSenderModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWasteSender(id: number): Observable<WasteSenderModel> {
    return this.http.delete<WasteSenderModel>(
      `${this.apiUrl}?id=${id}`,
      this.httpOptions
    );
  }
}
