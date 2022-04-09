import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SourceEmissionPollutant } from '@models/objects/source-emission-pollutant.model';

@Injectable({
  providedIn: 'root',
})
export class SourceEmissionPollutantService {
  subject = new Subject();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPollutantList(sourceId: number): Observable<SourceEmissionPollutant[]> {
    return this.http
      .get<SourceEmissionPollutant[]>(
        `api/SourceEmissionPollutant/list?sourceId=` + sourceId
      )
      .pipe(map((response) => response));
  }

  getPollutant(id: number): Observable<SourceEmissionPollutant[]> {
    return this.http
      .get<SourceEmissionPollutant[]>(`api/SourceEmissionPollutant?id=` + id)
      .pipe(map((response) => response));
  }

  addPollutant(
    data: SourceEmissionPollutant
  ): Observable<SourceEmissionPollutant> {
    return this.http.put<SourceEmissionPollutant>(
      'api/SourceEmissionPollutant',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePollutant(
    data: SourceEmissionPollutant
  ): Observable<SourceEmissionPollutant> {
    return this.http.put<SourceEmissionPollutant>(
      'api/SourceEmissionPollutant',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePollutant(id: number): Observable<SourceEmissionPollutant> {
    return this.http.delete<SourceEmissionPollutant>(
      `api/SourceEmissionPollutant?id=${id}`,
      this.httpOptions
    );
  }
}
