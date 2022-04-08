import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectModel } from '@models/objects/object.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  private readonly apiUrl = 'api/PekObject';

  constructor(private http: HttpClient) {}

  refreshObjectsSubject = new Subject();

  getObject(id: number): Observable<ObjectModel[]> {
    return this.http
      .get<ObjectModel[]>(`${this.apiUrl}?id=${id}`)
      .pipe(map((data: any) => data));
  }

  getObjects(): Observable<ObjectModel[]> {
    return this.http
      .get<ObjectModel[]>(`${this.apiUrl}/list?userId=1`)
      .pipe(map((response) => response));
  }

  addObject(data: ObjectModel): Observable<ObjectModel> {
    return this.http.put<ObjectModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateObject(data: ObjectModel): Observable<ObjectModel> {
    return this.http.put<ObjectModel>(
      this.apiUrl,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteObject(id: number): Observable<ObjectModel> {
    return this.http.delete<ObjectModel>(`${this.apiUrl}?id=${id}`);
  }
}
