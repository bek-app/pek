import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DicFreqMeasurementService {

  constructor(private http: HttpClient) {
  }

  getDicFreqMeasurement(): Observable<any> {
    return this.http.get<any>('api/DicFreqMeasurement').pipe(map(response => response));

  }
}
