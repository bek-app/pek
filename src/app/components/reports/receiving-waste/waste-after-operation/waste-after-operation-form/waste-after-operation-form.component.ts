import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WasteAfterOperationModel } from '@models/reports/receiving-waste/waste-after-operation.model';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { DicKindOperationService } from '@services/dictionary/dicKindOperation.service';
import { WasteAfterOperationService } from '@services/reports/receiving-waste/waste-after-operation.service';
@Component({
  selector: 'app-waste-after-operation-form',
  templateUrl: './waste-after-operation-form.component.html',
  styleUrls: ['./waste-after-operation-form.component.scss'],
})
export class WasteAfterOperationFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  wasteList: any[] = [];
  dicKindOperationList: any[] = [];
  afterOperationId!: number;
  receivingWasteId!: number;
  constructor(
    private fb: FormBuilder,
    private wasteAfterOperationService: WasteAfterOperationService,
    private dicWaste: DicWasteService,
    private dicKindOperationService: DicKindOperationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WasteAfterOperationFormComponent>
  ) {
    this.form = this.fb.group({
      generatedVolume: new FormControl('', [Validators.required]),
      reoperationVolume: new FormControl('', [Validators.required]),
      dicWasteId: new FormControl('', [Validators.required]),
      dicKindOperationId: new FormControl('', [Validators.required]),
    });

    const { receivingWasteId } = data;
    this.receivingWasteId = receivingWasteId;
  }

  ngOnInit(): void {
    this.dicWaste.getDicWaste().subscribe((data: any[]) => {
      this.wasteList = data;
    });

    this.initialDicKindOperation();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.afterOperationId ? this.afterOperationId : 0,
      receivingWasteId: this.receivingWasteId,
      ...this.form.value,
    };

    this.wasteAfterOperationService
      .addOrUpdateWasteAfterOperation(data)
      .subscribe({
        next: () => {
          this.dialogRef.close();
        },
      });
  }

  initialDicKindOperation() {
    this.dicKindOperationService.getDicKindOperation().subscribe((data) => {
      this.dicKindOperationList = data;
    });
  }

  addDicKindOperation(name: string) {
    const newObj = {
      id: 0,
      name,
    };
    this.dicKindOperationService
      .addDicKindOperation(newObj)
      .subscribe((res: any) => {
        this.initialDicKindOperation();
        this.form.controls['dicKindOperationId'].patchValue(res.id);
      });
  }

  editForm(id: number) {
    this.afterOperationId = id;
    this.wasteAfterOperationService
      .getWasteAfterOperationById(id)
      .subscribe((data: { [key: string]: any }) => {
        this.form.patchValue(data);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
