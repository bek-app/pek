import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BurialWasteModel } from '@models/burial-waste.model';

@Injectable({
  providedIn: 'root'
})
export class BurialWasteService {


  constructor(private http: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8 ' })
  };

  getBurialWasteById(id: number): Observable<BurialWasteModel[]> {
    return this.http.get<BurialWasteModel[]>('api/BurialWaste?id=' + id);
  }

  getBurialWasteList(id: number): Observable<BurialWasteModel[]> {
    return this.http.get<BurialWasteModel[]>('api/BurialWaste/list?reportId='+id);
  }

  addBurialWasteList(data: BurialWasteModel): Observable<BurialWasteModel> {
    return this.http.put<BurialWasteModel>('api/BurialWaste', JSON.stringify(data), this.httpOptions);
  }

  updateBurialWasteList(data: BurialWasteModel): Observable<BurialWasteModel> {
    return this.http.put<BurialWasteModel>('api/BurialWaste', JSON.stringify(data), this.httpOptions);
  }

  deleteBurialWasteById(id: number): Observable<BurialWasteModel> {
    return this.http.delete<BurialWasteModel>('api/BurialWaste?id=' + id);
  }
}
