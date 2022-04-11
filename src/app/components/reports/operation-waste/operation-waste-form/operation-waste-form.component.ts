import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Dictionary } from '@models/dictionary/dictionary.model';
import { OperationWasteModel } from '@models/reports/operation-waste/operation-waste.model';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { DicKindOperationService } from '@services/dictionary/dicKindOperation.service';
import { OperationWasteService } from '@services/reports/operation-waste/operation-waste.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-operation-waste-form',
  templateUrl: './operation-waste-form.component.html',
  styleUrls: ['./operation-waste-form.component.scss'],
})
export class OperationWasteFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  wastes: any[] = [];
  dicKindOperationList: any[] = [];
  viewMode!: boolean;
  isEdit = false;
  operationWasteId!: number;

  @Output() operationWasteAdd = new EventEmitter<OperationWasteModel>();
  constructor(
    private fb: FormBuilder,
    private operationService: OperationWasteService,
    private dicWaste: DicWasteService,
    private dicKindOperationService: DicKindOperationService
  ) {
    this.form = this.fb.group({
      performedVolume: new FormControl('', Validators.required),
      endBalance: new FormControl('', Validators.required),
      dicWasteId: new FormControl('', Validators.required),
      dicKindOperationId: new FormControl('', Validators.required),
      transferredVolume: new FormControl('', [Validators.required]),
      kindOperationBalanceId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.initialDicKindOperation();

    this.dicWaste.getDicWaste().subscribe((data: Dictionary[]) => {
      this.wastes = data;
    });

    this.form.valueChanges.pipe(debounceTime(1000)).subscribe((data) => {
      const performedVolume: number = data.performedVolume;
      const endBalance: number = data.endBalance;
      const transferredVolume: number = data.transferredVolume;

      if (transferredVolume > performedVolume) {
        this.form.controls['transferredVolume'].setErrors({
          incorrect: true,
          message:
            'Переданный объем отхода не должна превышать, объем отхода, с которым  проведены операций',
        });
      } else this.form.controls['transferredVolume'].setErrors(null);

      if (endBalance > performedVolume) {
        this.form.controls['endBalance'].setErrors({
          incorrect: true,
          message:
            'Оставшиеся объем отходов не должна превышать, объем отхода, с которым проведены операций',
        });
      } else this.form.controls['endBalance'].setErrors(null);
    });
  }

  initialDicKindOperation() {
    this.dicKindOperationService
      .getDicKindOperation()
      .subscribe((data: any[]) => {
        this.dicKindOperationList = data;
      });
  }

  editForm(id: number) {
    this.operationWasteId = id;
    this.operationService
      .getOperationWasteById(id)
      .subscribe((res: { [key: string]: any }) => this.form.patchValue(res));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.operationWasteId ? this.operationWasteId : 0,
      ...this.form.value,
    };

    this.operationWasteAdd.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
