import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '@models/dictionary/dictionary.model';
 
@Injectable({
  providedIn: 'root',
})
export class DicMaterialService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getDicMaterialLists(): Observable<Dictionary[]> {
    return this.http
      .get<Dictionary[]>('api/DicMaterial')
      .pipe(map((response) => response));
  }

  addDicMaterial(data: Dictionary): Observable<Dictionary> {
    return this.http.put<Dictionary>(
      'api/DicMaterial',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
