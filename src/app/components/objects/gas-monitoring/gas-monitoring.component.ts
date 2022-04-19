import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Column,
  GridOption,
  AngularGridInstance,
  Formatters,
  OnEventArgs,
  Formatter,
} from 'angular-slickgrid';
import { ActivatedRoute, Params } from '@angular/router';
import {
  GasMonitoringModel,
  GazMonitoringPointModel,
} from '@models/objects/gas-monitoring/gas-monitoring.model';
import { GasMonitoringService } from '@services/objects/gas-monitoring/gas-monitoring.service';
import { MatDialog } from '@angular/material/dialog';
import { GasMonitoringFormComponent } from './gas-monitoring-form/gas-monitoring-form.component';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { SharedService } from '@services/shared.service';
import { ObjectMapComponent } from '../object-map/object-map.component';
@Component({
  selector: 'app-gas-monitoring',
  templateUrl: './gas-monitoring.component.html',
  styleUrls: ['./gas-monitoring.component.scss'],
})
export class GasMonitoringComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: GasMonitoringModel[] = [];
  gridObj: any;
  dataViewObj: any;
  objectId!: number;
  gasMonitoringId!: number;
  gasMonitoringFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private gasMonitoringService: GasMonitoringService,
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

  refreshList(objectId: number) {
    this.gasMonitoringService
      .getGasMonitorings(objectId)
      .subscribe((data: GasMonitoringModel[]) => {
        this.dataset = data;
      });
  }

  openGasMonitoringForm() {
    this.gasMonitoringFormRef = this.dialog.open(GasMonitoringFormComponent, {
      width: '600px',
    });
    this.onGasMonitoringAdd();
    this.onGasMonitoringUpdate();
  }

  onGasMonitoringAdd() {
    this.gasMonitoringFormRef.componentInstance.onGasMonitoringAdd.subscribe({
      next: (value: GasMonitoringModel) => {
        const data = {
          ...value,
          pekObjectId: this.objectId,
        };

        this.gasMonitoringService.addGasMonitoring(data).subscribe(() => {
          this.gasMonitoringFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  onGasMonitoringUpdate() {
    this.gasMonitoringFormRef.componentInstance.onGasMonitoringUpdate.subscribe(
      {
        next: (value: GasMonitoringModel) => {
          const data = {
            id: this.gasMonitoringId,
            ...value,
            pekObjectId: this.objectId,
          };

          this.gasMonitoringService.updateGasMonitoring(data).subscribe(() => {
            this.gasMonitoringFormRef.close();
            this.refreshList(this.objectId);
          });
        },
      }
    );
  }

  onSelectedRowsChanged(e: any, args: any) {
    if (Array.isArray(args.rows)) {
      args.rows.forEach((idx: any) => {
        const item = this.gridObj.getDataItem(idx);
        this.gasMonitoringId = item.id;
      });
    }
  }

  openMap(data: GazMonitoringPointModel[]) {
    this.dialog.open(ObjectMapComponent, {
      data,
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'polygonName',
        name: 'Наименование полигона',
        field: 'polygonName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'countPoint',
        name: 'Количество контрольных  точек',
        field: 'countPoint',
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
          const id = args.dataContext.id;
          this.gasMonitoringService.getGazMonitoringPoints(id).subscribe({
            next: (points) => {
              this.openMap(points);
            },
          });
        },
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
          const id = args.dataContext.id;
          this.openGasMonitoringForm();
          this.gasMonitoringFormRef.componentInstance.form.disable();
          this.gasMonitoringFormRef.componentInstance.viewMode = true;
          this.gasMonitoringFormRef.componentInstance.editForm(id);
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
          const id = args.dataContext.id;
          this.openGasMonitoringForm();
          this.gasMonitoringFormRef.componentInstance.editForm(id);
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
              this.gasMonitoringService
                .deleteGasMonitoring(id)
                .subscribe(() => {
                  this.refreshList(this.objectId);
                });
            }
          });
        },
      },
    ];

    this.gridOptions = {
      gridWidth: '100%',
      gridHeight: 200,
      rowHeight: 35,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
      },
    };
  }
}
