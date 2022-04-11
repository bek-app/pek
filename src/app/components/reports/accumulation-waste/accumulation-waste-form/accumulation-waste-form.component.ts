import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccumulationWasteModel } from '@models/reports/accumulation-waste/accumulation-waste.model';
import { DicFreqMeasurementService } from '@services/dictionary/dic-freq-measurement.service';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { WastePlaceService } from '@services/objects/waste-place/waste-place.service';
import { AccumulationWasteService } from '@services/reports/accumulation-waste/accumulation-waste.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-accumulation-waste-form',
  templateUrl: './accumulation-waste-form.component.html',
  styleUrls: ['./accumulation-waste-form.component.scss'],
})
export class AccumulationWasteFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  wastes: any[] = [];
  dicFreqMeasurements: any[] = [];
  isActive = false;
  reportId!: number;
  viewMode!: boolean;
  @Output()
  accumulationWasteAdd = new EventEmitter<AccumulationWasteModel>();
  @Output()
  accumulationWasteUpdate = new EventEmitter<AccumulationWasteModel>();

  places: any[] = [];
  subs!: Subscription;
  constructor(
    private fb: FormBuilder,
    private accumulationService: AccumulationWasteService,
    private dicWaste: DicWasteService,
    private dicFreqMeas: DicFreqMeasurementService,
    private wastePlaceService: WastePlaceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      storageLimit: new FormControl('', Validators.required),
      beginBalance: new FormControl('', Validators.required),
      generatedVolume: new FormControl('', Validators.required),
      actualVolume: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      operationVolume: new FormControl('', Validators.required),
      endBalance: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      dicWasteId: new FormControl('', Validators.required),
      dicFreqMeasurementId: new FormControl('', Validators.required),
      measurementValue: new FormControl('', Validators.required),
      places: new FormControl('', Validators.required),
      transferredVolume: new FormControl(Validators.required),
    });
  }

  ngOnInit(): void {
    const { reportId } = this.data;
    this.reportId = reportId;
    this.dicWaste.getDicWaste().subscribe((data) => {
      this.wastes = data;
    });

    this.form.controls['dicFreqMeasurementId'].setValue(0);

    this.wastePlaceService
      .getWastePlaceByReportId(this.reportId)
      .subscribe((data: any[]) => {
        this.places = data;
      });

    this.dicFreqMeas.getDicFreqMeasurement().subscribe((data) => {
      this.dicFreqMeasurements = data;
    });

    this.calculateVolumeAccumWaste();
  }

  calculateVolumeAccumWaste() {
    let transferredVolume = 0;
    let operationVolume = 0;
    let generatedVolume: number;
    let beginBalance: number;
    let endBalance: number;

    //Остаток на начало отчётного периода, тонн
    this.form.controls['beginBalance'].valueChanges.subscribe((res) => {
      beginBalance = res;
    });

    //Образованный объем отходов на предприятий, тонн
    this.form.controls['generatedVolume'].valueChanges.subscribe((res) => {
      generatedVolume = res;
    });
    this.form.controls['operationVolume'].valueChanges.subscribe((res) => {
      operationVolume = res;
    });
    this.form.controls['transferredVolume'].valueChanges.subscribe((res) => {
      transferredVolume = res;
    });

    this.form.valueChanges.subscribe(() => {
      //Переданный объем отходов на проведение операции с ними, тонна

      if (transferredVolume <= beginBalance + generatedVolume) {
        this.form.controls['transferredVolume'].setValue(transferredVolume, {
          emitEvent: false,
        });
      }
      //Объем отхода, с которым проведены операции на предприятий, тонна
      if (operationVolume <= beginBalance + generatedVolume) {
        this.form.controls['operationVolume'].setValue(operationVolume, {
          emitEvent: false,
        });
      }
      //Фактический объем накопления за отчетный период, тонн
      if (transferredVolume + operationVolume < generatedVolume) {
        const actualVolume =
          generatedVolume - transferredVolume - operationVolume;
        this.form.controls['actualVolume'].setValue(actualVolume, {
          emitEvent: false,
        });
      } else {
        this.form.controls['actualVolume'].setValue(0, {
          emitEvent: false,
        });
      }
      //Остаток отходов в накопителе на конец отчетного периода, тонна
      endBalance =
        beginBalance + generatedVolume - transferredVolume - operationVolume;

      this.form.controls['endBalance'].setValue(endBalance, {
        emitEvent: false,
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  editForm(id: number) {
    this.isActive = true;
    this.accumulationService
      .getAccumulationWasteById(id)
      .subscribe((data: { [key: string]: any }) => {
        this.form.patchValue(data);
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;

    !this.isActive
      ? this.accumulationWasteAdd.emit(data)
      : this.accumulationWasteUpdate.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
