import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { WasteRemainingService } from '@services/reports/receiving-waste/waste-remaining.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-waste-remaining-form',
  templateUrl: './waste-remaining-form.component.html',
  styleUrls: ['./waste-remaining-form.component.scss'],
})
export class WasteRemainingFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  receivingWasteId!: number;
  remainingWasteId!: number;
  constructor(
    private fb: FormBuilder,
    private wasteRemainingService: WasteRemainingService,
    private accWSenderService: AccumulationWasteSenderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WasteRemainingFormComponent>
  ) {
    this.form = this.fb.group({
      binRemaining: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      nameRemaining: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      remainingVolume: new FormControl('', [Validators.required]),
    });

    const { receivingWasteId } = data;
    this.receivingWasteId = receivingWasteId;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form.controls['binRemaining'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['nameRemaining'].setValue(res.name);
        });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const nameRemaining = this.form.controls['nameRemaining'].value;
    const data = {
      id: this.remainingWasteId ? this.remainingWasteId : 0,
      receivingWasteId: this.receivingWasteId,
      ...this.form.value,
      nameRemaining,
    };

    this.wasteRemainingService.addOrUpdateWasteRemaining(data).subscribe({
      next: () => this.dialogRef.close(),
    });
  }

  editForm(id: number) {
    this.remainingWasteId = id;
    this.wasteRemainingService
      .getWasteRemainingById(id)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }
}
