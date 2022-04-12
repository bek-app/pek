import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReceivedWasteModel } from '@models/reports/receiving-waste/received-waste.model';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { ReceivedWasteService } from '@services/reports/receiving-waste/received-waste.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-received-waste-form',
  templateUrl: './received-waste-form.component.html',
  styleUrls: ['./received-waste-form.component.scss'],
})
export class ReceivedWasteFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  receivedWasteId!: number;

  @Output()
  addOrUpdateWasteReceived = new EventEmitter<ReceivedWasteModel>();
  constructor(
    private fb: FormBuilder,
    private wasteReceivedService: ReceivedWasteService,
    private accWSenderService: AccumulationWasteSenderService
  ) {
    this.form = this.fb.group({
      binTransferred: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      nameTransferred: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      transferredVolume: new FormControl('', [Validators.required]),
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.form.controls['binTransferred'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['nameTransferred'].setValue(res.name);
        });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let nameTransferred = this.form.controls['nameTransferred'].value;
    const data = {
      id: this.receivedWasteId ? this.receivedWasteId : 0,
      ...this.form.value,
      nameTransferred,
    };

    this.addOrUpdateWasteReceived.emit(data);
  }

  editForm(id: number) {
    this.receivedWasteId = id;
    this.wasteReceivedService
      .getReceivedWasteById(id)
      .subscribe((data: { [key: string]: any }) => {
        this.form.patchValue(data);
      });
  }
}
