import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
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
import { OperationWasteSenderModel } from '@models/reports/operation-waste/operation-waste.model';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { OperationWasteSenderService } from '@services/reports/operation-waste/operation-waste-sender.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-operation-waste-sender-form',
  templateUrl: './operation-waste-sender-form.component.html',
  styleUrls: ['./operation-waste-sender-form.component.scss'],
})
export class OperationWasteSenderFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  wastes: any[] = [];
  dicKindOperationList: any[] = [];
  viewMode!: boolean;
  operationWasteSenderId!: number;

  @Output()
  operationWasteSenderAdd = new EventEmitter<OperationWasteSenderModel>();

  @Input() OnlyNumber!: boolean;
  constructor(
    private fb: FormBuilder,
    private operationSenderService: OperationWasteSenderService,
    private dicWaste: DicWasteService,
    private accWSenderService: AccumulationWasteSenderService
  ) {
    this.form = this.fb.group({
      transferredVolume: new FormControl('', Validators.required),
      binTransferred: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      nameTransferred: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      dicWasteId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.dicWaste.getDicWaste().subscribe((data) => {
      this.wastes = data;
    });

    this.form.controls['binTransferred'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['nameTransferred'].setValue(res.name);
        });
      });
  }

  editForm(id: number) {
    this.operationWasteSenderId = id;
    this.operationSenderService
      .getOperationWasteSenderById(id)
      .subscribe((res) => {
        this.form.patchValue(res);
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let nameTransferred = this.form.controls['nameTransferred'].value;

    const data = {
      id: this.operationWasteSenderId ? this.operationWasteSenderId : 0,
      ...this.form.value,
      nameTransferred,
    };

    this.operationWasteSenderAdd.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
