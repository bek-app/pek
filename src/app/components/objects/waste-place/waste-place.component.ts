import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Params } from '@angular/router';
import { WastePlaceModel } from '@models/objects/waste-place/waste-place.model';
import { WastePlaceService } from '@services/objects/waste-place/waste-place.service';
import { MatDialog } from '@angular/material/dialog';
import { WastePlaceFormComponent } from './waste-place-form/waste-place-form.component';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-waste-place',
  templateUrl: './waste-place.component.html',
  styleUrls: ['./waste-place.component.scss'],
})
export class WastePlaceComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WastePlaceModel[] = [];
  gridObj: any;
  dataViewObj: any;
  objectId!: number;
  wastePlaceId!: number;
  wastePlaceFormRef: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private wsPlaceService: WastePlaceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((param: Params) => {
      this.objectId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.refreshList(this.objectId);
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wsPlaceService
      .getWastePlaceListByObjectId(id)
      .subscribe((data: WastePlaceModel[]) => {
        this.dataset = data;
      });
  }

  openWastePlaceDialog() {
    this.wastePlaceFormRef = this.dialog.open(WastePlaceFormComponent, {
      width: '60%',
    });
    this.onAddWastePlace();
    this.onUpdateWastePlace();
  }

  onAddWastePlace() {
    this.wastePlaceFormRef.componentInstance.addWastePlace.subscribe({
      next: (value: WastePlaceModel) => {
        const data = {
          ...value,
          pekObjectId: this.objectId,
        };
        this.wsPlaceService.addWastePlace(data).subscribe(() => {
          this.wastePlaceFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  onUpdateWastePlace() {
    this.wastePlaceFormRef.componentInstance.updateWastePlace.subscribe({
      next: (value: WastePlaceModel) => {
        const data = {
          id: this.wastePlaceId,
          ...value,
          pekObjectId: this.objectId,
        };
        this.wsPlaceService.updateWastePlace(data).subscribe(() => {
          this.wastePlaceFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
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
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.wastePlaceId = args.dataContext.id;
          this.openWastePlaceDialog();
          this.wastePlaceFormRef.componentInstance.form.disable();
          this.wastePlaceFormRef.componentInstance.viewMode = true;
          this.wastePlaceFormRef.componentInstance.editForm(this.wastePlaceId);
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
          this.wastePlaceId = args.dataContext.id;
          this.openWastePlaceDialog();
          this.wastePlaceFormRef.componentInstance.editForm(this.wastePlaceId);
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
              this.wsPlaceService.deleteWastePlace(id).subscribe(() => {
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
