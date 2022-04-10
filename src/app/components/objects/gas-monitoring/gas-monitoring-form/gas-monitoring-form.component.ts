import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GasMonitoringService } from '@services/objects/gas-monitoring/gas-monitoring.service';
import { GasMonitoringComponent } from '../gas-monitoring.component';
@Component({
  selector: 'app-gas-monitoring-form',
  templateUrl: './gas-monitoring-form.component.html',
  styleUrls: ['./gas-monitoring-form.component.scss'],
})
export class GasMonitoringFormComponent implements OnInit {
  submitted = false;
  showModal = false;
  objectId!: number;
  form: FormGroup;
  formArea: FormGroup;
  formCoords: FormGroup;
  areaLists: any[] = [];
  coordsLists: any[] = [];
  selectedAreaId: any;
  editAreaMode?: boolean;
  editAreaId?: number;
  editCoordMode?: boolean;
  editCoordId?: number;
  viewMode!: boolean;
  @Input() editMode: any;
  @Input() isActive = false;

  @Output() onGasMonitoringAdd = new EventEmitter<any>();
  @Output() onGasMonitoringUpdate = new EventEmitter<any>();

  constructor(
    private gasService: GasMonitoringService,
    public fb: FormBuilder
  ) {
    this.form = this.fb.group({
      polygonName: new FormControl('', [Validators.required]),
      polygonFile: new FormControl(),
    });
    this.formArea = this.fb.group({
      area: new FormControl('', [Validators.required]),
    });
    this.formCoords = this.fb.group({
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get fArea(): { [key: string]: AbstractControl } {
    return this.formArea.controls;
  }
  get fCoords(): { [key: string]: AbstractControl } {
    return this.formCoords.controls;
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
    this.editMode = true;
  }

  removeArea(i: number) {
    this.areaLists.splice(i, 1);
    this.editMode = false;
  }

  removeCoords(i: number) {
    this.coordsLists.splice(i, 1);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = {
      ...this.form.value,
    };
    if (!this.isActive) {
      this.onGasMonitoringAdd.emit(data);
    } else {
      this.onGasMonitoringUpdate.emit(data);
    }

    if (this.form.statusChanges) {
      this.submitted = false;
      const allLists: any = [];
      this.areaLists.forEach((t) => {
        const newCoords = this.coordsLists.filter(
          (k) => k.parentId == t.areaId
        );
        // .map(({ lat, lng }) => ({ lat, lng }))
        // .map((k) => {
        //   return Object.values(k);
        // });
        console.log(newCoords);
        const eachArea = { ...t, coords: newCoords };
        allLists.push(eachArea);
      });

      const data = {
        polygonName: this.form.value.polygonName,
        polygonFile: JSON.stringify(allLists),
      };

      this.areaLists = [];
      this.coordsLists = [];
      this.editMode = false;
    }
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

  editForm(id: number) {
    this.isActive = true;
    this.gasService.getGasMonitoring(id).subscribe((data: any) => {
      this.form.patchValue(data);
      const polFile = JSON.parse(data.polygonFile);
      polFile.map((item: any) => {
        this.areaLists.push(item);
        return item.coords.map((item: any) => {
          return this.coordsLists.push(item);
        });
      });
      console.log(data);
    });
  }
}
