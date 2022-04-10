import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WasteWaterModel } from '@models/objects/waste-water/waste-water.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WasteWaterService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getDicMeasurementProcedure(term: string): Observable<any> {
    return this.http
      .get<any>(`api/DicMeasurementProcedure?term=` + term)
      .pipe(map((response) => response));
  }

  addDicMeasurementProcedure(name: string): Observable<string> {
    return this.http.post<string>(
      'api/DicMeasurementProcedure?name=' + name,
      this.httpOptions
    );
  }

  getWasteWater(id: number): Observable<WasteWaterModel> {
    return this.http
      .get<WasteWaterModel>(`api/PekWasteWater?id=` + id)
      .pipe(map((response) => response));
  }

  getWasteWaterList(objectId: number): Observable<WasteWaterModel[]> {
    return this.http
      .get<WasteWaterModel[]>(
        'api/PekWasteWater/montorings?objectId=' + objectId
      )
      .pipe(map((response) => response));
  }

  addWasteWater(data: WasteWaterModel): Observable<WasteWaterModel> {
    return this.http.put<WasteWaterModel>(
      'api/PekWasteWater',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateWasteWater(data: WasteWaterModel): Observable<WasteWaterModel> {
    return this.http.put<WasteWaterModel>(
      'api/PekWasteWater',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteWasteWater(id: number): Observable<WasteWaterModel> {
    return this.http.delete<WasteWaterModel>(
      `api/PekWasteWater?id=${id}`,
      this.httpOptions
    );
  }
}
