import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public editDataDetails: any = [];
  public subject = new Subject<any>();

  private source = new BehaviorSubject(this.editDataDetails);
  currentSource = this.source.asObservable();

  send(payload: any) {
    this.source.next(payload);
  }
}
