import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReportModel } from '@models/reports/report.model';
import { ObjectsService } from '@services/objects/objects.service';
import { ReportService } from '@services/reports/report.service';
@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent implements OnInit {
  form: FormGroup;
  kvartal: any[] = [];
  objects: any[] = [];
  submitted?: boolean;
  viewMode!: boolean;
  @Input() index!: number;
  @Input() isActive = false;
  @Output() addReport = new EventEmitter<ReportModel>();
  @Output() updateReport = new EventEmitter<ReportModel>();

  constructor(
    private fb: FormBuilder,
    private objectsService: ObjectsService,
    private reportService: ReportService
  ) {
    this.form = this.fb.group({
      reportYear: new FormControl(2020, Validators.required),
      kvartal: new FormControl('', Validators.required),
      pekObjectId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.reportService.getKvartal().subscribe((data) => {
      this.kvartal = data;
    });

    this.objectsService.getObjects().subscribe((data) => {
      this.objects = data;
    });
  }

  editForm(id: number) {
    this.isActive = true;
    this.reportService
      .getReport(id)
      .subscribe((data: { [key: string]: any }) => this.form.patchValue(data));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;

    !this.isActive ? this.addReport.emit(data) : this.updateReport.emit(data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
