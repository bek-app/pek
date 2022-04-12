import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WasteOperationModel } from '@models/reports/receiving-waste/waste-operation.model';
import { DicKindOperationService } from '@services/dictionary/dicKindOperation.service';
import { WasteOperationService } from '@services/reports/receiving-waste/waste-operation.service';
@Component({
  selector: 'app-waste-operation-form',
  templateUrl: './waste-operation-form.component.html',
  styleUrls: ['./waste-operation-form.component.scss'],
})
export class WasteOperationFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  dicKindOperationList: any[] = [];
  wasteOperationId!: number;
  @Output()
  addOrUpdateWasteOperation = new EventEmitter<WasteOperationModel>();

  constructor(
    private fb: FormBuilder,
    private wasteOperationService: WasteOperationService,
    private dicKindOperationService: DicKindOperationService
  ) {
    this.form = this.fb.group({
      transactionalVolume: new FormControl('', [Validators.required]),
      dicKindOperationId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getDicKindOperation();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.wasteOperationId ? this.wasteOperationId : 0,
      ...this.form.value,
    };

    this.addOrUpdateWasteOperation.emit(data);
  }

  getDicKindOperation() {
    this.dicKindOperationService
      .getDicKindOperation()
      .subscribe((data: any[]) => {
        this.dicKindOperationList = data;
      });
  }

  editForm(id: number) {
    this.wasteOperationId = id;
    this.wasteOperationService
      .getWasteOperationById(id)
      .subscribe((data: { [key: string]: any }) => {
        this.form.patchValue(data);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
