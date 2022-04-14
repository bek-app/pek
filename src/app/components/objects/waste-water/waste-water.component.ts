import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Params } from '@angular/router';
import { WasteWaterModel } from '@models/objects/waste-water/waste-water.model';
import { WasteWaterService } from '@services/objects/waste-water/waste-water.service';
import { MatDialog } from '@angular/material/dialog';
import { WasteWaterFormComponent } from './waste-water-form/waste-water-form.component';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { SharedService } from '@services/shared.service';
@Component({
  selector: 'app-waste-water',
  templateUrl: './waste-water.component.html',
  styleUrls: ['./waste-water.component.scss'],
})
export class WasteWaterComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WasteWaterModel[] = [];
  gridObj: any;
  dataViewObj: any;

  objectId!: number;
  wsWaterId!: number;
  wsWaterFormRef: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private wsWaterService: WasteWaterService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.sharedService.currentSource.subscribe(() => {
      setTimeout(() => {
        this.angularGrid.resizerService.resizeGrid();
      }, 100);
    });
    this.route.params.subscribe((param: Params) => {
      this.objectId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.refreshList(this.objectId);
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wsWaterService
      .getWasteWaterList(id)
      .subscribe((data: WasteWaterModel[]) => {
        this.dataset = data;
      });
  }

  openWasteWaterDialog() {
    this.wsWaterFormRef = this.dialog.open(WasteWaterFormComponent, {
      width: '800px',
    });
    this.onWasteWaterAdd();
    this.onWasteWaterUpdate();
  }

  onWasteWaterAdd() {
    this.wsWaterFormRef.componentInstance.wasteWaterAdd.subscribe({
      next: (value: WasteWaterModel) => {
        const data = {
          ...value,
          pekObjectId: this.objectId,
        };
        console.log(data);

        this.wsWaterService.addWasteWater(data).subscribe((res) => {
          this.wsWaterFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  onWasteWaterUpdate() {
    this.wsWaterFormRef.componentInstance.wasteWaterUpdate.subscribe({
      next: (value: WasteWaterModel) => {
        const data = {
          id: this.wsWaterId,
          ...value,
          pekObjectId: this.objectId,
        };

        this.wsWaterService.updateWasteWater(data).subscribe(() => {
          this.wsWaterFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'sourceName',
        name: 'Наименование',
        field: 'sourceName',
        filterable: true,
        sortable: true,
      },

      {
        id: 'coords',
        name: 'Координаты',
        field: 'coords',
        filterable: true,
        sortable: true,
      },
      {
        id: 'measurementProc',
        name: 'Методика выполнения измерения',
        field: 'measurementProc',
        filterable: true,
        sortable: true,
      },

      {
        id: 'measurementName',
        name: 'Наименование измерения ',
        field: 'measurementName',
      },
      {
        id: 'wasteNames',
        name: 'Наименование загрязняющих веществ',
        field: 'wasteNames',
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
          this.wsWaterId = args.dataContext.id;
          this.openWasteWaterDialog();
          this.wsWaterFormRef.componentInstance.form.disable();
          this.wsWaterFormRef.componentInstance.viewMode = true;
          this.wsWaterFormRef.componentInstance.editForm(this.wsWaterId);
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
          this.wsWaterId = args.dataContext.id;
          this.openWasteWaterDialog();
          this.wsWaterFormRef.componentInstance.editForm(this.wsWaterId);
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
              this.wsWaterService.deleteWasteWater(id).subscribe(() => {
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
