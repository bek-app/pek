import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BurialWasteModel } from '@models/objects/burial-place/burial-waste.model';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { BurialPlaceService } from '@services/objects/burial-place/burial-place.service';
import { BurialWasteService } from '@services/objects/burial-place/burial-waste.service';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-burial-waste-form',
  templateUrl: './burial-waste-form.component.html',
  styleUrls: ['./burial-waste-form.component.scss'],
})
export class BurialWasteFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  wastes: any[] = [];
  viewMode!: boolean;
  places: any[] = [];
  reportId!: number;
  burialWasteId!: number;
  @Output() burialWasteAddOrUpdate = new EventEmitter<BurialWasteModel>();

  constructor(
    private fb: FormBuilder,
    private burialWasteService: BurialWasteService,
    private dicWaste: DicWasteService,
    private burialPlaceService: BurialPlaceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      generatedVolume: new FormControl('', Validators.required),
      burialVolume: new FormControl('', Validators.required),
      burialLimit: new FormControl('', Validators.required),
      actualVolume: new FormControl('', Validators.required),
      dicWasteId: new FormControl([], Validators.required),
      places: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    const { reportId } = this.data;
    this.reportId = reportId;

    this.dicWaste.getDicWaste().subscribe((data: any[]) => {
      this.wastes = data;
    });

    this.burialPlaceService
      .getBurialPlaceByReportId(this.reportId)
      .subscribe((data: any[]) => {
        this.places = data;
      });

    this.form.valueChanges.pipe(debounceTime(1000)).subscribe((data) => {
      const generatedVolume: number = data.generatedVolume;
      const actualVolume: number = data.actualVolume;

      if (actualVolume > generatedVolume) {
        this.form.controls['actualVolume'].setErrors({
          incorrect: true,
          message:
            'Фактический объем не должна превышать, образованного объема',
        });
      } else this.form.controls['actualVolume'].setErrors(null);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.burialWasteId ? this.burialWasteId : 0,
      ...this.form.value,
    };

    this.burialWasteAddOrUpdate.emit(data);
  }

  editForm(id: number) {
    this.burialWasteId = id;
    this.burialWasteService
      .getBurialWasteById(id)
      .subscribe((res: { [key: string]: any }) => this.form.patchValue(res));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
