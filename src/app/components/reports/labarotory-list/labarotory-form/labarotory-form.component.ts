import { Component, Inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { LabarotoryService } from '@services/reports/labarotory/labarotory.service';
import { debounceTime } from 'rxjs/operators';
import { WasteRemainingFormComponent } from '../../receiving-waste/waste-remaining/waste-remaining-form/waste-remaining-form.component';

@Component({
  selector: 'app-labarotory-form',
  templateUrl: './labarotory-form.component.html',
  styleUrls: ['./labarotory-form.component.scss'],
})
export class LabarotoryFormComponent implements OnInit {
  reportId!: number;
  labId!: number;
  form!: FormGroup;
  submitted?: boolean;

  viewMode!: boolean;

  constructor(
    private fb: FormBuilder,
    private labService: LabarotoryService,
    private accWSenderService: AccumulationWasteSenderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WasteRemainingFormComponent>
  ) {
    this.form = this.fb.group({
      bin: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      orgName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      regNumber: new FormControl('', [Validators.required]),
      beginDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      kindActitvity: new FormControl(''),
    });

    this.reportId = data.reportId;
  }

  ngOnInit(): void {
    this.form.controls['bin'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['orgName'].setValue(res.name);
        });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let orgName = this.form.controls['orgName'].value;
    const data = {
      id: this.labId ? this.labId : 0,
      reportId: this.reportId,
      ...this.form.value,
      orgName,
    };
    console.log(data);

    this.labService.addOrUpdateLabarotory(data).subscribe({
      next: () => this.dialogRef.close(),
    });
  }

  editForm(id: number) {
    this.labId = id;
    this.labService
      .getLabarotoryById(id)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
