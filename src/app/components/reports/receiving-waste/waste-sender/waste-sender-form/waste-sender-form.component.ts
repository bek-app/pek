import {
  Component,
  EventEmitter,
  Inject,
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { WasteSenderService } from '@services/reports/receiving-waste/waste-sender.service';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-waste-sender-form',
  templateUrl: './waste-sender-form.component.html',
  styleUrls: ['./waste-sender-form.component.scss'],
})
export class WasteSenderFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  viewMode!: boolean;
  receivingWasteId!: number;
  wasteSenderId!: number;
  constructor(
    private fb: FormBuilder,
    private wasteSednerService: WasteSenderService,
    private accWSenderService: AccumulationWasteSenderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WasteSenderFormComponent>
  ) {
    this.form = this.fb.group({
      binTransferred: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\s\S]{12}$/),
      ]),
      nameTransferred: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      transferredVolume: new FormControl('', [Validators.required]),
    });

    const { receivingWasteId } = data;
    this.receivingWasteId = receivingWasteId;
  }

  ngOnInit(): void {
    this.form.controls['binTransferred'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((bin) => {
        this.accWSenderService.getBinName(bin).subscribe((res: any) => {
          this.form.controls['nameTransferred'].setValue(res.name);
        });
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const nameTransferred = this.form.controls['nameTransferred'].value;

    const data = {
      id: this.wasteSenderId ? this.wasteSenderId : 0,
      receivingWasteId: this.receivingWasteId,
      ...this.form.value,
      nameTransferred,
    };

    this.wasteSednerService
      .addOrUpdateWasteSender(data)
      .subscribe({ next: () => this.dialogRef.close() });
  }

  editForm(id: number) {
    this.wasteSenderId = id;
    this.wasteSednerService
      .getWasteSenderById(id)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
