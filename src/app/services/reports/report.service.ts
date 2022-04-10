import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportModel } from '@models/reports/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}


  getKvartal(): Observable<ReportModel[]> {
    return this.http
      .get<ReportModel[]>('api/ReportKvartal/kvartal')
      .pipe(map((res: any) => res));
  }

  getReport(id: number): Observable<ReportModel> {
    return this.http
      .get<ReportModel>('api/ReportKvartal?id=' + id)
      .pipe(map((res) => res));
  }

  getReportList(): Observable<ReportModel[]> {
    return this.http
      .get<ReportModel[]>('api/ReportKvartal/list')
      .pipe(map((res: any) => res));
  }

  // /

  changeStatusReport(id: number): Observable<any> {
    return this.http
      .put<any>('api/ReportKvartal/changeStatus?id=' + id, this.httpOptions)
      .pipe(map((response) => response));
  }

  addReport(data: ReportModel): Observable<any> {
    return this.http
      .put<any>('api/ReportKvartal', JSON.stringify(data), this.httpOptions)
      .pipe(map((response) => response));
  }

  updateReport(
    data: ReportModel
  ): Observable<ReportModel> {
    return this.http.put<ReportModel>(
      'api/ReportKvartal',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteReport(id: number): Observable<ReportModel> {
    return this.http.delete<ReportModel>('api/ReportKvartal?id=' + id);
  }
}
