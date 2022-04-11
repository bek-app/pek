import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { AccumulationWasteSenderModel } from '@models/reports/accumulation-waste/accumulation-waste-sender.model';
@Component({
  selector: 'app-accumulation-waste-sender-form',
  templateUrl: './accumulation-waste-sender-form.component.html',
  styleUrls: ['./accumulation-waste-sender-form.component.scss'],
})
export class AccumulationWasteSenderFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  isActive = false;
  @Output()
  accWasteSenderAdd = new EventEmitter<AccumulationWasteSenderModel>();
  @Output()
  accWasteSenderUpdate = new EventEmitter<AccumulationWasteSenderModel>();

  constructor(
    private fb: FormBuilder,
    private accWSenderService: AccumulationWasteSenderService
  ) {
    this.form = this.fb.group({
      transferredVolume: new FormControl('', Validators.required),
      binTransferred: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      nameTransferred: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });
  }

  ngOnInit(): void {
    this.form.controls['binTransferred'].valueChanges
      .pipe(debounceTime(1500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['nameTransferred'].setValue(res.name);
        });
      });
  }

  editForm(id: number) {
    this.isActive = true;
    this.accWSenderService
      .getAccumulationWasteSenderById(id)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const nameTransferred = this.form.controls['nameTransferred'].value;
    const data = {
      ...this.form.value,
      nameTransferred,
    };

    console.log(data);

    !this.isActive
      ? this.accWasteSenderAdd.emit(data)
      : this.accWasteSenderUpdate.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
