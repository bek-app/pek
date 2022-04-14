import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { GazMonitoringPointModel } from '@models/objects/gas-monitoring/gas-monitoring.model';
import { GasMonitoringService } from '@services/objects/gas-monitoring/gas-monitoring.service';
import { SharedService } from '@services/shared.service';
import {
  Column,
  GridOption,
  AngularGridInstance,
  Formatters,
  OnEventArgs,
} from 'angular-slickgrid';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { PointsFormComponent } from './points-form/points-form.component';
@Component({
  selector: 'app-gas-monitoring-points',
  templateUrl: './gas-monitoring-points.component.html',
  styleUrls: ['./gas-monitoring-points.component.scss'],
})
export class GasMonitoringPointsComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: GazMonitoringPointModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() gasMonitoringId!: number;
  monitoringPointId!: number;
  pointFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private gasMonitoringService: GasMonitoringService,
    private dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.sharedService.currentSource.subscribe(() => {
      setTimeout(() => {
        this.angularGrid.resizerService.resizeGrid();
      }, 100);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['gasMonitoringId'];
    if (currentValue) {
      this.gasMonitoringId = currentValue;
      this.refreshList(currentValue);
    }
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(monitoringId: number) {
    this.gasMonitoringService
      .getGazMonitoringPoints(monitoringId)
      .subscribe((res) => {
        this.dataset = res;
      });
  }

  openPointsDialog() {
    this.pointFormRef = this.dialog.open(PointsFormComponent, {
      width: '800px',
    });

    this.onGasMonitoringPointAdd();
    this.onGasMonitoringPointUpdate();
  }

  onGasMonitoringPointAdd() {
    this.pointFormRef.componentInstance.onGasMonitoringPointAdd.subscribe({
      next: (value: GazMonitoringPointModel) => {
        const data = {
          gazMonitoringId: this.gasMonitoringId,
          ...value,
        };
        this.gasMonitoringService.addGazMonitoringPoint(data).subscribe({
          next: () => {
            this.pointFormRef.close();
            this.refreshList(this.gasMonitoringId);
          },
        });
      },
    });
  }

  onGasMonitoringPointUpdate() {
    this.pointFormRef.componentInstance.onGasMonitoringPointUpdate.subscribe({
      next: (value: GazMonitoringPointModel) => {
        const data = {
          id: this.monitoringPointId,
          gazMonitoringId: this.gasMonitoringId,
          ...value,
        };
        this.gasMonitoringService.updateGazMonitoringPoint(data).subscribe({
          next: () => {
            this.pointFormRef.close();
            this.refreshList(this.gasMonitoringId);
          },
        });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'pointNumber',
        name: 'Номера контрольных точек',
        field: 'pointNumber',
        filterable: true,
        sortable: true,
      },
      {
        id: 'observableParam',
        name: 'Наблюдаемые параметры ',
        field: 'observableParam',
        filterable: true,
        sortable: true,
      },

      {
        id: 'measurementFullName',
        name: 'Полное имя измерения',
        field: 'measurementFullName',
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
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.monitoringPointId = args.dataContext.id;
          this.openPointsDialog();
          this.pointFormRef.componentInstance.form.disable();
          this.pointFormRef.componentInstance.editForm(this.monitoringPointId);
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
          this.monitoringPointId = args.dataContext.id;
          this.openPointsDialog();
          this.pointFormRef.componentInstance.editForm(this.monitoringPointId);
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
                .deleteGazMonitoringPoint(id)
                .subscribe(() => {
                  this.refreshList(this.gasMonitoringId);
                });
            }
          });
        },
      },
    ];
    this.gridOptions = {};
  }
}
