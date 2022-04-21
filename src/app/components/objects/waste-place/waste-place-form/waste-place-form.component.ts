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
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { WastePlaceModel } from '@models/objects/waste-place/waste-place.model';
import { WastePlaceService } from '@services/objects/waste-place/waste-place.service';

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
  areaList: any[] = [];
  selectedAreaId: any;
  editAreaMode?: boolean;
  editAreaId?: number;
  editCoordMode?: boolean;
  editCoordId?: number;
  isActive = false;
  @Output()
  addWastePlace = new EventEmitter<WastePlaceModel>();
  @Output()
  updateWastePlace = new EventEmitter<WastePlaceModel>();

  expandedElement: any | null;
  @ViewChild('table', { static: true, read: MatTable }) table: any;

  displayedColumns = ['areaId', 'area', 'deleteBtn', 'action'];

  constructor(
    public fb: FormBuilder,
    private wastePlaceService: WastePlaceService
  ) {
    this.form = this.fb.group({
      nameObject: new FormControl('', [Validators.required]),
      area: new FormControl(),
      lat: new FormControl(),
      lng: new FormControl(),
    });
  }

  ngOnInit(): void {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  addArea(): void {
    if (!this.form.controls['area'].value) {
      return;
    }
    this.areaList.push({
      areaId: this.areaList.length,
      area: this.form.controls['area'].value,
      coords: [],
    });
    this.form.controls['area'].reset();
    this.table.renderRows();
  }

  deleteArea(i: number, areaList: any): void {
    areaList.splice(i, 1);
  }

  addCoords(detail: any): void {
    if (!this.form.controls['lat'].value && !this.form.controls['lng'].value) {
      return;
    }

    detail.coords.push([
      this.form.controls['lat'].value,
      this.form.controls['lng'].value,
    ]);

    this.form.controls['lat'].reset();
    this.form.controls['lng'].reset();
  }

  deleteCoord(i: number, coords: [lat: number, lng: number]): void {
    coords.splice(i, 1);
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
    console.log(data);

    !this.isActive
      ? this.addWastePlace.emit(data)
      : this.updateWastePlace.emit(data);
  }

  editForm(id: number) {
    this.isActive = true;
    this.wastePlaceService.getWastePlace(id).subscribe((res: any) => {
      const areas = JSON.parse(res.coords);
      this.areaList = areas;
      this.form.controls['nameObject'].setValue(res.nameObject);
      this.table.renderRows();
    });
  }
}
