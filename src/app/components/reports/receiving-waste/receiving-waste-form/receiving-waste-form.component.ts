import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReceivingWasteModel } from '@models/reports/receiving-waste/receiving-waste.model';
import { DicWasteService } from '@services/dictionary/dic-waste.service';
import { DicKindOperationService } from '@services/dictionary/dicKindOperation.service';
import { ReceivingWasteService } from '@services/reports/receiving-waste/receiving-waste.service';
@Component({
  selector: 'app-receiving-waste-form',
  templateUrl: './receiving-waste-form.component.html',
  styleUrls: ['./receiving-waste-form.component.scss'],
})
export class ReceivingWasteFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  wastes: any[] = [];
  viewMode!: boolean;
  receivingWasteId!: number;
  @Output()
  addOrUpdateReceivingWaste = new EventEmitter<ReceivingWasteModel>();

  constructor(
    private fb: FormBuilder,
    private receivinWasteService: ReceivingWasteService,
    private dicWaste: DicWasteService,
   ) {
    this.form = this.fb.group({
      dicWasteId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dicWaste.getDicWaste().subscribe((data) => {
      this.wastes = data;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      id: this.receivingWasteId ? this.receivingWasteId : 0,
      ...this.form.value,
    };

    this.addOrUpdateReceivingWaste.emit(data);
  }

  editForm(receivingWasteId: number) {
    this.receivingWasteId = receivingWasteId;
    this.receivinWasteService
      .getReceivingWasteById(receivingWasteId)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
