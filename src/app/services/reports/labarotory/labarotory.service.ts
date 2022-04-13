import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabarotoryModel } from '@models/reports/labarotory/labarotory.model';

@Injectable({
  providedIn: 'root',
})
export class LabarotoryService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getLabarotoryById(id: number): Observable<LabarotoryModel> {
    return this.http
      .get<LabarotoryModel>('api/TestingLab?id=' + id)
      .pipe(map((data: any) => data));
  }

  getLabarotoryList(reportId: number): Observable<LabarotoryModel[]> {
    return this.http
      .get<LabarotoryModel[]>('api/TestingLab/list?reportId=' + reportId)
      .pipe(map((data: any) => data));
  }

  addOrUpdateLabarotory(data: LabarotoryModel): Observable<LabarotoryModel> {
    return this.http.put<LabarotoryModel>(
      'api/TestingLab',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteLabarotory(id: number): Observable<LabarotoryModel> {
    return this.http.delete<LabarotoryModel>('api/TestingLab?id=' + id);
  }
}
