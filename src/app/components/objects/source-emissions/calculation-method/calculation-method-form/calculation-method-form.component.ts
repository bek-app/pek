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
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@models/dictionary/dictionary.model';
import { SourceEmission } from '@models/objects/sources.model';
import { DicCalculationMethodService } from '@services/dictionary/dic-calc-method.service';
import { DicFreqMeasurementService } from '@services/dictionary/dic-freq-measurement.service';
import { DicMaterialService } from '@services/dictionary/dic-material.service';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';
import { DicFormComponent } from 'src/app/components/dic-form/dic-form.component';

@Component({
  selector: 'app-calculation-method-form',
  templateUrl: './calculation-method-form.component.html',
  styleUrls: ['./calculation-method-form.component.scss'],
})
export class CalculationMethodFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isActive = false;
  @Output() onSourceCreate = new EventEmitter<SourceEmission>();
  @Output() onSourceUpdated = new EventEmitter<SourceEmission>();

  viewMode!: boolean;
  dicFreqMeasurements: any[] = [];
  materials: any[] = [];
  calcMethods: any[] = [];
  dicFormRef: any;
  constructor(
    private fb: FormBuilder,
    private sourceEmissionService: SourceEmissionsService,
    private dicFreqMeasurementService: DicFreqMeasurementService,
    private dicMaterialService: DicMaterialService,
    private dicCalculationMethodService: DicCalculationMethodService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      sourceName: new FormControl('', [Validators.required]),
      lat: new FormControl(''),
      lng: new FormControl(''),
      materials: new FormControl('', [Validators.required]),
      calcMethods: new FormControl('', [Validators.required]),
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

    this.getDicMaterials();
    this.getDicCalcMethods();
  }

  getDicMaterials() {
    this.dicMaterialService.getDicMaterialLists().subscribe((res) => {
      console.log(res);

      this.materials = res;
    });
  }

  getDicCalcMethods() {
    this.dicCalculationMethodService
      .getDicCalculationMethodLists()
      .subscribe((res) => (this.calcMethods = res));
  }

  openDicFormDialog(name: string) {
    this.dicFormRef = this.dialog.open(DicFormComponent, {
      width: '500px',
    });
    this.dicFormRef.componentInstance.dicTitle =
      'Добавить не существующий в списке';
    if (name === 'materials') {
      this.dicFormRef.componentInstance.dicLabel = 'Материалы';
      this.onDicMaterialAdd();
    } else {
      this.dicFormRef.componentInstance.dicLabel = 'Расчетный метод';
      this.onDicCalcMethodAdd();
    }
  }

  onDicMaterialAdd() {
    this.dicFormRef.componentInstance.dicAdded.subscribe({
      next: (data: Dictionary) => {
        this.dicMaterialService.addDicMaterial(data).subscribe((res: any) => {
          this.getDicMaterials();
          this.dicFormRef.close();
          this.form.controls['materials'].setValue([res.id]);
        });
      },
    });
  }

  onDicCalcMethodAdd() {
    this.dicFormRef.componentInstance.dicAdded.subscribe({
      next: (data: Dictionary) => {
        this.dicCalculationMethodService
          .addDicCalculationMethod(data)
          .subscribe((res: any) => {
            this.getDicCalcMethods();
            this.dicFormRef.close();
            this.form.controls['calcMethods'].setValue([res.id]);
          });
      },
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

    this.sourceEmissionService.getSourceEmission(id).subscribe({
      next: (value: SourceEmission) => {
        this.form.patchValue(value);
      },
    });
  }
}
