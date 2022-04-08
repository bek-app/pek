import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { SourceEmission } from '@models/objects/sources.model';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SourceEmissionsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  public sourceEmissionRefresh = new Subject<any>();
  public areaEmissionRefresh = new Subject<any>();
  sourceId = new Subject();
  constructor(private http: HttpClient) {}

  getAreaEmission(id: number): Observable<any[]> {
    return this.http
      .get<any[]>('/api/AreaEmission/?id=' + id)
      .pipe(map((response) => response));
  }

  getAreaEmissionList(objectId: number): Observable<any[]> {
    return this.http
      .get<any[]>('/api/AreaEmission/list?objectId=' + objectId)
      .pipe(map((response) => response));
  }

  addAreaEmission(data: any): Observable<any> {
    return this.http.put<any>(
      'api/AreaEmission',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateAreaEmission(data: any): Observable<any> {
    return this.http.put<any>(
      'api/AreaEmission',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteAreaEmission(id: number): Observable<any> {
    return this.http.delete<any>('api/AreaEmission?id=' + id, this.httpOptions);
  }

  //
  getSourceEmissionById(id: number): Observable<SourceEmission[]> {
    return this.http
      .get<SourceEmission[]>(`api/SourceEmission?id=` + id)
      .pipe(map((response) => response));
  }

  getSourceEmissionList(
    areaId: number,
    disc: string
  ): Observable<SourceEmission[]> {
    return this.http
      .get<SourceEmission[]>(
        `api/SourceEmission/list?areaId=${areaId}&discriminator=${disc}`
      )
      .pipe(map((response) => response));
  }

  addSourceEmission(data: SourceEmission): Observable<SourceEmission> {
    return this.http.put<SourceEmission>(
      'api/SourceEmission',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateSourceEmission(data: SourceEmission): Observable<SourceEmission> {
    return this.http.put<SourceEmission>(
      'api/SourceEmission',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteSourceEmission(id: number): Observable<SourceEmission> {
    return this.http.delete<SourceEmission>(
      'api/SourceEmission?id=' + id,
      this.httpOptions
    );
  }
}
