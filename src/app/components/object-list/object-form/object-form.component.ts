import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
import { ObjectModel } from '@models/objects/object.model';
import { DicKatoService } from '@services/dictionary/dic-kato.service';
import { ObjectsService } from '@services/objects/objects.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.scss'],
})
export class ObjectFormComponent implements OnInit {
  isActive = false;
  form: FormGroup;
  submitted?: boolean;
  oblast: any[] = [];
  region: any[] = [];
  subRegion: any[] = [];
  village: any[] = [];
  oblastName!: string;
  regionName!: string;
  subRegionName!: string;
  villageName!: string;
  address!: string;
  viewMode = false;

  @Output() objectCreated = new EventEmitter<ObjectModel>();
  @Output() objectUpdated = new EventEmitter<ObjectModel>();
  subs!: Subscription;
  constructor(
    private fb: FormBuilder,
    private dicKatoService: DicKatoService,
    private objectsService: ObjectsService
  ) {
    this.form = this.fb.group({
      nameObject: new FormControl('', Validators.required),
      oblastId: new FormControl('', Validators.required),
      regionId: new FormControl('', Validators.required),
      subRegionId: new FormControl(),
      villageId: new FormControl(),
      address: new FormControl(),
      inactive: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
    this.dicKatoService.getDicKato(1).subscribe((data: any[]) => {
      this.oblast = data;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { externalUserId: 1, ...this.form.value };
    !this.isActive
      ? this.objectCreated.emit(data)
      : this.objectUpdated.emit(data);
  }

  editForm(id: number) {
    this.isActive = true;
    this.objectsService.getObject(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  oblastChange(oblastId: number) {
    if (oblastId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.form.value.oblastId
      )?.name;

      if (this.oblastName) {
        this.form.controls['address'].setValue(this.oblastName);
        this.form.controls['regionId'].setValue(null);
        this.subRegion = [];
        this.village = [];
      }
      this.dicKatoService.getDicKato(oblastId).subscribe((region: any[]) => {
        this.region = region;
      });
    }
  }

  regionChange(regionId: number) {
    if (regionId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.form.value.oblastId
      )?.name;

      this.regionName = this.region.find((reg) => reg.id === regionId)?.name;

      if (this.oblastName && this.regionName) {
        this.address = `${this.oblastName}, ${this.regionName}`;
        this.form.controls['address'].setValue(this.address);
        this.form.value.villageId = null;
        this.form.value.subRegionId = null;
        this.village = [];
      }

      this.dicKatoService.getDicKato(regionId).subscribe((subRegion: any[]) => {
        this.subRegion = subRegion;
      });
    }
  }

  subRegionChange(subRegionId: number) {
    if (subRegionId) {
      this.subRegionName = this.subRegion.find(
        (subReg) => subReg.id === subRegionId
      )?.name;

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.form.value.oblastId
        )?.name;

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.form.value.regionId
        )?.name;

      if (this.oblastName && this.regionName && this.subRegionName) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName} `;
        this.form.controls['address'].setValue(this.address);
      }
      this.dicKatoService
        .getDicKato(subRegionId)
        .subscribe((village: any[]) => {
          this.village = village;
        });
    }
  }

  villageChange(villageId: number) {
    if (villageId) {
      this.villageName = this.village.find(
        (vill) => vill.id === villageId
      )?.name;

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.form.value.oblastId
        )?.name;

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.form.value.regionId
        )?.name;

      if (!this.subRegionName)
        this.subRegionName = this.subRegion.find(
          (subReg) => subReg.id === this.form.value.subRegionId
        )?.name;

      if (
        this.oblastName &&
        this.regionName &&
        this.subRegionName &&
        this.villageName
      ) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName}, ${this.villageName}`;
        this.form.controls['address'].setValue(this.address);
      }
    }
  }
}
