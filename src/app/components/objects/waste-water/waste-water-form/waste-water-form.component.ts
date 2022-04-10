import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { WasteWaterModel } from '@models/objects/waste-water/waste-water.model';
import { DicPollutantsService } from '@services/dictionary/dic-pollutants.service';
import { WasteWaterService } from '@services/objects/waste-water/waste-water.service';
import { DicFreqMeasurementService } from '@services/dictionary/dic-freq-measurement.service';
import { MatDialog } from '@angular/material/dialog';
import { DicFormComponent } from 'src/app/components/dic-form/dic-form.component';
import { MtxSelectComponent } from '@ng-matero/extensions/select';
import { Dictionary } from '@models/dictionary/dictionary.model';
@Component({
  selector: 'app-waste-water-form',
  templateUrl: './waste-water-form.component.html',
  styleUrls: ['./waste-water-form.component.scss'],
})
export class WasteWaterFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isActive = false;
  @Output() wasteWaterAdd = new EventEmitter<WasteWaterModel>();
  @Output() wasteWaterUpdate = new EventEmitter<WasteWaterModel>();

  dicFreqMeasurements: any[] = [];
  viewMode!: boolean;
  pollutants$!: Observable<any>;
  dicMeasurementProcedure$!: Observable<any>;
  loading = false;
  input$ = new Subject<string>();
  selectedDicMeasurementProcedure: any;
  dicFormRef: any;
  @ViewChild('selectMeasurementProc')
  selectMeasurementProc!: MtxSelectComponent;
  constructor(
    public fb: FormBuilder,
    private dicPollutantsService: DicPollutantsService,
    private wasteWaterService: WasteWaterService,
    private dicFreqMeasurementService: DicFreqMeasurementService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      sourceName: new FormControl('', [Validators.required]),
      lat: new FormControl(),
      lng: new FormControl(),
      measurementValue: new FormControl('', [Validators.required]),
      dicFreqMeasurementId: new FormControl('', [Validators.required]),
      dicMeasurementProcedureId: new FormControl(null, Validators.required),
      wasteList: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dicFreqMeasurementService.getDicFreqMeasurement().subscribe((res) => {
      this.dicFreqMeasurements = res;
    });

    this.loadDicMeasurementProcedure();
    this.loadPollutants();
  }

  openDicFormDialog(): void {
    this.selectMeasurementProc.close();
    this.dicFormRef = this.dialog.open(DicFormComponent, {
      width: '600px',
    });

    this.dicFormRef.componentInstance.dicTitle =
      'Добавить не существующий в списке';

    this.dicFormRef.componentInstance.dicLabel =
      'Методика выполнения измерения';

    this.addDicMeasurementProcedure();
  }

  addDicMeasurementProcedure() {
    this.dicFormRef.componentInstance.dicAdded.subscribe({
      next: (data: Dictionary) => {
        let name = data['name'];
        this.wasteWaterService.addDicMeasurementProcedure(name).subscribe({
          next: (res: any) => {
            this.dicFormRef.close();
            this.form.controls['dicMeasurementProcedureId'].setValue({
              id: res.modelId,
              name,
            });
          },
        });
      },
    });
  }

  private loadDicMeasurementProcedure() {
    this.dicMeasurementProcedure$ = concat(
      of([]), // default items
      this.input$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term) =>
          this.wasteWaterService.getDicMeasurementProcedure(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        )
      )
    );
  }

  private loadPollutants() {
    this.pollutants$ = concat(
      of([]), // default items
      this.input$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term) =>
          this.dicPollutantsService.getDicPollutantList(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false))
          )
        )
      )
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const wasteId = this.form.controls['wasteList'].value.map((item: any) => {
      return item.id;
    });

    const dicMeasurementProcedureId =
      this.form.controls['dicMeasurementProcedureId'].value.id;

    const obj = {
      ...this.form.value,
      wastes: wasteId,
      dicMeasurementProcedureId,
    };

    !this.isActive
      ? this.wasteWaterAdd.emit(obj)
      : this.wasteWaterUpdate.emit(obj);
  }

  editForm(id: number) {
    this.isActive = true;
    this.wasteWaterService.getWasteWater(id).subscribe((data: any) => {
      this.form.patchValue(data);
      data.dicMeasurementProcedure.forEach((item: any) => {
        this.form.controls['dicMeasurementProcedureId'].setValue(item);
      });
    });
  }

  trackByFn(item: any) {
    return item.id;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
