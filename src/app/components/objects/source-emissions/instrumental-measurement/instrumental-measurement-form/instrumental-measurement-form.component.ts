import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SourceEmission } from '@models/objects/sources.model';
import { DicFreqMeasurementService } from '@services/dictionary/dic-freq-measurement.service';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';

@Component({
  selector: 'app-instrumental-measurement-form',
  templateUrl: './instrumental-measurement-form.component.html',
  styleUrls: ['./instrumental-measurement-form.component.scss'],
})
export class InstrumentalMeasurementFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isActive = false;
  @Output() onSourceCreate = new EventEmitter<SourceEmission>();
  @Output() onSourceUpdated = new EventEmitter<SourceEmission>();

  dicFreqMeasurements: any[] = [];
  viewMode!: boolean;

  constructor(
    private fb: FormBuilder,
    private sourceEmissionService: SourceEmissionsService,
    private dicFreqMeasurementService: DicFreqMeasurementService
  ) {
    this.form = this.fb.group({
      sourceName: new FormControl('', [Validators.required]),
      projectCapacity: new FormControl('', [Validators.required]),
      lat: new FormControl(),
      lng: new FormControl(),
      measurementValue: new FormControl('', [Validators.required]),
      dicFreqMeasurementId: new FormControl('', [Validators.required]),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.dicFreqMeasurementService.getDicFreqMeasurement().subscribe((res) => {
      this.dicFreqMeasurements = res;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const obj = { ...this.form.value };
    !this.isActive
      ? this.onSourceCreate.emit(obj)
      : this.onSourceUpdated.emit(obj);
  }

  editForm(id: number) {
    this.isActive = true;
    console.log(id);

    this.sourceEmissionService.getSourceEmission(id).subscribe({
      next: (value: SourceEmission) => {
        this.form.patchValue(value);
      },
    });
  }
}
