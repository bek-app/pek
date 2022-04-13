import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RadiationService } from '@services/reports/radiation/radiation.service';

@Component({
  selector: 'app-radiation-form',
  templateUrl: './radiation-form.component.html',
  styleUrls: ['./radiation-form.component.scss'],
})
export class RadiationFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  radiationId!: number;
  reportId!: number;
  eliminationDeadline = new Date();
  viewMode!: boolean;

  constructor(
    private fb: FormBuilder,
    private radiationService: RadiationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RadiationFormComponent>
  ) {
    this.form = this.fb.group({
      sourceName: new FormControl('', [Validators.required]),
      standartLimit: new FormControl('', [Validators.required]),
      actualVolume: new FormControl('', [Validators.required]),
      exceedingVolume: new FormControl('', [Validators.required]),
      eliminationDeadline: new FormControl('', [Validators.required]),
      correctiveMeasures: new FormControl(),
    });
    this.reportId = data.reportId;
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.radiationId ? this.radiationId : 0,
      reportId: this.reportId,
      ...this.form.value,
    };
    this.radiationService.addOrUpdateRadiation(data).subscribe({
      next: () => this.dialogRef.close(),
    });
  }

  editForm(id: number) {
    this.radiationId = id;
    this.radiationService
      .getRadiationById(id)
      .subscribe((data: { [key: string]: any }) => {
        this.form.patchValue(data);
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
