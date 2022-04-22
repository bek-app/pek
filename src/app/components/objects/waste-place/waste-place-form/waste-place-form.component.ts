import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { WastePlaceModel } from '@models/objects/waste-place/waste-place.model';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-waste-place-form',
  templateUrl: './waste-place-form.component.html',
  styleUrls: ['./waste-place-form.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class WastePlaceFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  viewMode!: boolean;
  areaList: any[] = [
    {
      area: 'Участок 1',
      coords: [[51, 71]],
    },
  ];
  coordIdx!: number;
  isEditCoord!: boolean;
  @Output()
  addOrUpdatePlace = new EventEmitter<WastePlaceModel>();

  expandedElement: any | null;
  @ViewChild('table', { static: true, read: MatTable }) table: any;

  displayedColumns = ['area', 'deleteBtn', 'action'];

  constructor(public fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      nameObject: new FormControl('', [Validators.required]),
      area: new FormControl(),
      lat: new FormControl(),
      lng: new FormControl(),
    });
  }

  ngOnInit(): void {
    console.log(this.areaList);
  }

  addArea(): void {
    if (!this.form.controls['area'].value) {
      return;
    }
    
    this.areaList.push({
      area: this.form.controls['area'].value,
      coords: [],
    });

    this.form.controls['area'].reset();
    this.table.renderRows();
  }

  deleteArea(i: number, areaList: any): void {
    const dialogData = new ConfirmDialogModel(
      'Подтвердить действие',
      'Вы уверены, что хотите удалить это?'
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult: any) => {
      if (dialogResult) {
        areaList.splice(i, 1);
        this.table.renderRows();
      }
    });
  }

  addCoord(detail: any): void {
    if (!this.form.controls['lat'].value && !this.form.controls['lng'].value) {
      return;
    }

    const { coords } = detail;
    if (!this.isEditCoord) {
      coords.push([
        this.form.controls['lat'].value,
        this.form.controls['lng'].value,
      ]);
    } else {
      coords[this.coordIdx][0] = this.form.controls['lat'].value;
      coords[this.coordIdx][1] = this.form.controls['lng'].value;
      this.isEditCoord = false;
    }

    this.form.controls['lat'].reset();
    this.form.controls['lng'].reset();
  }

  deleteCoord(i: number, coords: any): void {
    coords.splice(i, 1);
  }

  editCoord(i: number, coords: any) {
    this.isEditCoord = true;
    this.coordIdx = i;
    this.form.controls['lat'].setValue(coords[i][0]);
    this.form.controls['lng'].setValue(coords[i][1]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = {
      nameObject: this.form.value.nameObject,
      coords: JSON.stringify(this.areaList),
    };

    this.addOrUpdatePlace.emit(data);
  }

  editForm(data: WastePlaceModel) {
    const areas = JSON.parse(data.coords as string);
    this.areaList = areas;
    this.form.controls['nameObject'].setValue(data.nameObject);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
