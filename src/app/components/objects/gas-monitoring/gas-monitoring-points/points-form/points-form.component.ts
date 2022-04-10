import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GazMonitoringPointModel } from '@models/objects/gas-monitoring/gas-monitoring.model';
import { DicFreqMeasurementService } from '@services/dictionary/dic-freq-measurement.service';
import { GasMonitoringService } from '@services/objects/gas-monitoring/gas-monitoring.service';
@Component({
  selector: 'app-points-form',
  templateUrl: './points-form.component.html',
  styleUrls: ['./points-form.component.scss'],
})
export class PointsFormComponent implements OnInit {
  form: FormGroup;
  @Input() isActive = false;
  submitted = false;
  viewMode!: boolean;
  dicFreqMeasurements: any[] = [];

  @Output() onGasMonitoringPointAdd =
    new EventEmitter<GazMonitoringPointModel>();
  @Output() onGasMonitoringPointUpdate =
    new EventEmitter<GazMonitoringPointModel>();

  constructor(
    public fb: FormBuilder,
    private dicFreqMeasurementService: DicFreqMeasurementService,
    private gasMonitoringService: GasMonitoringService
  ) {
    this.form = this.fb.group({
      pointNumber: new FormControl('', [Validators.required]),
      observableParam: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
      measurementValue: new FormControl('', [Validators.required]),
      dicFreqMeasurementId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dicFreqMeasurementService.getDicFreqMeasurement().subscribe((res) => {
      this.dicFreqMeasurements = res;
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  editForm(id: number) {
    this.isActive = true;
    this.gasMonitoringService.getGazMonitoringPoint(id).subscribe({
      next: (value) => this.form.patchValue(value),
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;

    !this.isActive
      ? this.onGasMonitoringPointAdd.emit(data)
      : this.onGasMonitoringPointUpdate.emit(data);
  }
}
