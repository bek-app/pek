import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Params } from '@angular/router';
import { BurialPlaceFormComponent } from './burial-place-form/burial-place-form.component';
import { BurialPlaceModel } from '@models/objects/burial-place/burial-place.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BurialPlaceService } from '@services/objects/burial-place/burial-place.service';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { SharedService } from '@services/shared.service';
import { ObjectMapComponent } from '../object-map/object-map.component';
import { WastePlaceFormComponent } from '../waste-place/waste-place-form/waste-place-form.component';
@Component({
  selector: 'app-burial-place',
  templateUrl: './burial-place.component.html',
  styleUrls: ['./burial-place.component.scss'],
})
export class BurialPlaceComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: BurialPlaceModel[] = [];
  gridObj: any;
  dataViewObj: any;
  burialPlaceId!: number;
  objectId!: number;
  burialPlaceFormRef!: MatDialogRef<WastePlaceFormComponent>;
  isEdit = false;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private burialPlaceService: BurialPlaceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((param: Params) => {
      this.objectId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.defineGrid();
    this.refreshList(this.objectId);
  }

  refreshList(id: number) {
    this.burialPlaceService
      .getBurialPlaceList(id)
      .subscribe((data: BurialPlaceModel[]) => (this.dataset = data));
  }

  openBurialPlaceDialog() {
    this.burialPlaceFormRef = this.dialog.open(WastePlaceFormComponent, {
      width: '60%',
      hasBackdrop: false,
      position: {
        top: '50px',
      },
    });

    this.addOrUpdatePlace();
    this.burialPlaceFormRef.afterClosed().subscribe(() => {
      this.isEdit = false;
    });
  }

  addOrUpdatePlace() {
    this.burialPlaceFormRef.componentInstance.addOrUpdatePlace.subscribe({
      next: (value: BurialPlaceModel) => {
        const data = {
          id: this.isEdit ? this.burialPlaceId : 0,
          ...value,
          pekObjectId: this.objectId,
        };
        this.burialPlaceService.addOrUpdateBurialPlace(data).subscribe(() => {
          this.burialPlaceFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  openMap(data: any) {
    this.dialog.open(ObjectMapComponent, {
      data,
    });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.burialPlaceId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'nameObject',
        name: 'Наименование',
        field: 'nameObject',
        filterable: true,
        sortable: true,
      },
      {
        id: 'map',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-map pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const data = args.dataContext;
          const coords = JSON.parse(data.coords);
          this.openMap(coords);
        },
      },
      {
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer" ></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const data = args.dataContext;
          this.openBurialPlaceDialog();
          this.burialPlaceFormRef.componentInstance.form.disable();
          this.burialPlaceFormRef.componentInstance.editForm(data);
          this.burialPlaceFormRef.componentInstance.viewMode = true;
        },
      },
      {
        id: 'edit',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const data = args.dataContext;
          this.isEdit = true;
          this.openBurialPlaceDialog();
          this.burialPlaceFormRef.componentInstance.editForm(data);
        },
      },
      {
        id: 'delete',
        field: 'delete',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
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
              this.burialPlaceService.deleteBurialPlace(id).subscribe(() => {
                this.refreshList(this.objectId);
              });
            }
          });
        },
      },
    ];

    this.gridOptions = {};
  }
}
