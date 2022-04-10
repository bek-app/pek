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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WastePlaceModel } from '@models/objects/waste-place/waste-place.model';
import { WastePlaceService } from '@services/objects/waste-place/waste-place.service';
@Component({
  selector: 'app-waste-place-form',
  templateUrl: './waste-place-form.component.html',
  styleUrls: ['./waste-place-form.component.scss'],
})
export class WastePlaceFormComponent implements OnInit {
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

  isActive = false;
  @Output()
  addWastePlace = new EventEmitter<WastePlaceModel>();
  @Output()
  updateWastePlace = new EventEmitter<WastePlaceModel>();
  constructor(
    public fb: FormBuilder,
    private wastePlaceService: WastePlaceService
  ) {
    this.form = this.fb.group({
      nameObject: new FormControl('', [Validators.required]),
      coords: new FormControl(''),
    });
    this.formArea = this.fb.group({
      area: new FormControl('', [Validators.required]),
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

  get fArea(): { [key: string]: AbstractControl } {
    return this.formArea.controls;
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
          this.formCoords.reset();
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
    this.formCoords.reset();
  }

  selectedArea(i: number) {
    this.selectedAreaId = i;
  }

  removeArea(i: number) {
    this.areaLists.splice(i, 1);
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
    };
    
    !this.isActive
      ? this.addWastePlace.emit(data)
      : this.updateWastePlace.emit(data);
  }

  editForm(id: number) {
    this.isActive = true;
    this.wastePlaceService.getWastePlace(id).subscribe((res: any) => {
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
