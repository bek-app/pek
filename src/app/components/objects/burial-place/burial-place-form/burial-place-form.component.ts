import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BurialPlaceModel } from '@models/objects/burial-place/burial-place.model';
import { BurialPlaceService } from '@services/objects/burial-place/burial-place.service';
@Component({
  selector: 'app-burial-place-form',
  templateUrl: './burial-place-form.component.html',
  styleUrls: ['./burial-place-form.component.scss'],
})
export class BurialPlaceFormComponent implements OnInit {
  form: FormGroup;
  formCoords: FormGroup;
  formArea: FormGroup;
  submitted = false;
  viewMode!: boolean;
  areaLists: any[] = [];
  coordsLists: any[] = [];
  selectedAreaId: any;
  editAreaMode?: boolean;
  editAreaId?: number;
  editCoordMode?: boolean;
  editCoordId?: number;
  editMode!: boolean;
  @Input() isActive = false;
  @Output()
  addBurialPlace = new EventEmitter<BurialPlaceModel>();
  @Output()
  updateBurialPlace = new EventEmitter<BurialPlaceModel>();
  @Output() hideFormModal = new EventEmitter();
  constructor(
    public fb: FormBuilder,
    private burialPlaceService: BurialPlaceService
  ) {
    this.form = this.fb.group({
      nameObject: new FormControl('', [Validators.required]),
      coords: new FormControl(''),
    });
    this.formArea = this.fb.group({
      area: new FormControl(),
    });
    this.formCoords = this.fb.group({
      lat: new FormControl(),
      lng: new FormControl(),
    });
  }

  ngOnInit(): void {
    console.log();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  addArea() {
    if (this.formArea.invalid) {
      return;
    }
    if (!this.editAreaMode) {
      const list = { areaId: this.areaLists.length, ...this.formArea.value };
      this.areaLists.push(list);
    } else {
      this.areaLists.forEach((item: any) => {
        if (this.editAreaId === item.areaId) {
          item.area = this.formArea.value.area;
        }
      });
      this.editAreaMode = false;
    }

    this.formArea.reset();
  }
  addCoords() {
    if (this.formCoords.invalid) {
      return;
    }
    if (!this.editCoordMode) {
      this.areaLists.filter((item: any) => {
        if (this.selectedAreaId === item.areaId) {
          const list = {
            id: this.coordsLists.length,
            parentId: this.selectedAreaId,
            ...this.formCoords.value,
          };
          this.coordsLists.push(list);
        }
      });
    } else {
      this.coordsLists.forEach((item: any) => {
        console.log(item);
        if (this.editCoordId === item.id) {
          item.lat = this.formCoords.value.lat;
          item.lng = this.formCoords.value.lng;
        }
      });
      this.editCoordMode = false;
    }
  }

  selectedArea(i: number) {
    this.selectedAreaId = i;
    this.editMode = true;
  }

  removeArea(i: number) {
    this.areaLists.splice(i, 1);
    this.editMode = false;
  }

  removeCoords(i: number) {
    this.coordsLists.splice(i, 1);
  }

  editArea(id: number, list: any) {
    this.editAreaId = id;
    this.editAreaMode = true;
    this.formArea.patchValue(list);
  }

  editCoord(id: number, coord: any) {
    this.editCoordMode = true;
    this.editCoordId = id;
    this.formCoords.patchValue(coord);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    const allLists: any = [];
    this.areaLists.forEach((t) => {
      const newCoords = this.coordsLists.filter((k) => k.parentId == t.areaId);

      const eachArea = { ...t, coords: newCoords };
      allLists.push(eachArea);
    });

    const data = {
      nameObject: this.form.value.nameObject,
      coords: JSON.stringify(allLists),
    };
    !this.isActive
      ? this.addBurialPlace.emit(data)
      : this.updateBurialPlace.emit(data);
  }
  editForm(id: number) {
    this.burialPlaceService.getBurialPlace(id).subscribe((res: any) => {
      console.log(res);
      const coords = JSON.parse(res.coords);
      coords.map((item: any) => {
        this.areaLists.push(item);
        return item.coords.map((item: any) => {
          return this.coordsLists.push(item);
        });
      });

      this.form.patchValue(res);
    });
  }
}
