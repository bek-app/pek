import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable, isDevMode } from '@angular/core';
import { OperationsWasteInfoModel, WasteDisposalInfo } from '../models/models';
import { MockOperationsWasteInfo } from '../mock/mock-operations-waste-info';

@Injectable({
  providedIn: 'root'
})
export class OperationsWasteInfoService {
  private APIUrl = 'api/dictionary/getList?dicType=dic';

  constructor(private http: HttpClient) {
  }

  operationsWasteInfoList = new MockOperationsWasteInfo();

  getOperationsWasteInfoList(): Observable<OperationsWasteInfoModel[]> {
    if (isDevMode()) {
      return of(this.operationsWasteInfoList.operationsWasteInfoList);
    } else {
      return this.http.get<OperationsWasteInfoModel[]>(this.APIUrl);
    }
  }
}
