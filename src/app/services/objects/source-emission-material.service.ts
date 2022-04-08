import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SourceEmissionMaterial } from '@models/source-emission-material.model';

@Injectable({
  providedIn: 'root',
})
export class SourceEmissionMaterialService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };


  constructor(private http: HttpClient) {}

  getMaterialLists(sourceId: number): Observable<SourceEmissionMaterial[]> {
    return this.http
      .get<SourceEmissionMaterial[]>(
        `api/SourceEmissionMaterial/list?sourceId=` + sourceId
      )
      .pipe(map((response) => response));
  }
  getMaterialById(id: number): Observable<SourceEmissionMaterial[]> {
    return this.http
      .get<SourceEmissionMaterial[]>(`api/SourceEmissionMaterial?id=` + id)
      .pipe(map((response) => response));
  }
  addMaterial(
    data: SourceEmissionMaterial
  ): Observable<SourceEmissionMaterial> {
    return this.http.put<SourceEmissionMaterial>(
      'api/SourceEmissionMaterial',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  updateMaterial(
    data: SourceEmissionMaterial
  ): Observable<SourceEmissionMaterial> {
    return this.http.put<SourceEmissionMaterial>(
      'api/SourceEmissionMaterial',
      JSON.stringify(data),
      this.httpOptions
    );
  }
  deleteMaterial(id: number): Observable<SourceEmissionMaterial> {
    return this.http.delete<SourceEmissionMaterial>(
      `api/SourceEmissionMaterial?id=${id}`,
      this.httpOptions
    );
  }
}
