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
import { Dictionary } from '@models/dictionary/dictionary.model';
import { SourceEmissionPollutant } from '@models/objects/source-emission-pollutant.model';
import { DicPollutantsService } from '@services/dictionary/dic-pollutants.service';
import { SourceEmissionPollutantService } from '@services/objects/source-emission-pollutant.service';
import {
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-pollutants-form',
  templateUrl: './pollutants-form.component.html',
  styleUrls: ['./pollutants-form.component.scss'],
})
export class PollutantsFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isActive = false;
  viewMode!: boolean;
  pollutants$!: Observable<any>;
  input$ = new Subject<string>();
  loading = false;

  @Output()
  onPollutantAdded = new EventEmitter<SourceEmissionPollutant>();
  @Output()
  onPollutantUpdated = new EventEmitter<SourceEmissionPollutant>();

  constructor(
    private fb: FormBuilder,
    private sourceEmissionPollutantService: SourceEmissionPollutantService,
    private dicPollutantsService: DicPollutantsService
  ) {
    this.form = this.fb.group({
      standartLimitGS: new FormControl('', [Validators.required]),
      standartLimitTons: new FormControl('', [Validators.required]),
      dicPollutantId: new FormControl('', [Validators.required]),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit() {
    this.loadPollutants();
  }

  trackByFn(item: any) {
    return item.id;
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

    let dicPollutantId = this.form.controls['dicPollutantId'].value;
    const data = { ...this.form.value, dicPollutantId: dicPollutantId.id };

    !this.isActive
      ? this.onPollutantAdded.emit(data)
      : this.onPollutantUpdated.emit(data);
  }

  editForm(id: number) {
    this.isActive = true;
    this.sourceEmissionPollutantService.getPollutant(id).subscribe({
      next: (data: any) => {
        this.form.patchValue(data);
        this.form.controls['dicPollutantId'].setValue({
          id: data.dicPollutantId,
          name: data.dicPollutantName,
        });
      },
    });
  }
}
