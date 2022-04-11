import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { OperationWasteFormComponent } from './operation-waste-form/operation-waste-form.component';
import { OperationWasteModel } from '@models/reports/operation-waste/operation-waste.model';
import { OperationWasteService } from '@services/reports/operation-waste/operation-waste.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-operation-waste',
  templateUrl: './operation-waste.component.html',
  styleUrls: ['./operation-waste.component.scss'],
})
export class OperationWasteComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: OperationWasteModel[] = [];
  gridObj: any;
  dataViewObj: any;
  reportId!: number;
  operationWasteId!: number;
  operWsFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private operationWasteService: OperationWasteService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((param) => {
      this.reportId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.refreshList(this.reportId);
    this.defineGrid();
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.operationWasteId = item.id;
  }

  refreshList(reportId: number) {
    this.operationWasteService
      .getOperationWasteListByReportId(reportId)
      .subscribe((res) => (this.dataset = res));
  }

  openOperWsFormDialog() {
    this.operWsFormRef = this.dialog.open(OperationWasteFormComponent, {
      width: '800px',
    });

    this.onOperationWasteAdd();
  }

  onOperationWasteAdd() {
    this.operWsFormRef.componentInstance.operationWasteAdd.subscribe({
      next: (payload: OperationWasteModel) => {
        const data = {
          ...payload,
          reportId: this.reportId,
        };

        this.operationWasteService.addOperationWaste(data).subscribe(() => {
          this.operWsFormRef.close();
          this.refreshList(this.reportId);
        });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'wasteName',
        name: 'Вид отхода',
        field: 'wasteName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'dicKindOperationName',
        name: 'Вид операции ',
        field: 'dicKindOperationName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'performedVolume',
        name: 'Объем проведенных операции (тонн)',
        field: 'performedVolume',
        filterable: true,
        sortable: true,
      },

      {
        id: 'binTransferred',
        name: 'БИН',
        field: 'binTransferred',
        filterable: true,
        sortable: true,
      },
      {
        id: 'endBalance',
        name: 'Оставшиеся объем отходов (тонн)',
        field: 'endBalance',
        filterable: true,
        sortable: true,
      },
      {
        id: 'transferredVolume',
        name: 'Переданный объем отхода (тонн)',
        field: 'transferredVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'kindOperationBalanceName',
        name: 'Вид операции с оставшимся объемом отходов ',
        field: 'kindOperationBalanceName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => ` <i class="fa fa-eye pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openOperWsFormDialog();
          this.operWsFormRef.componentInstance.editForm(this.operationWasteId);
          this.operWsFormRef.componentInstance.form.disable();
          this.operWsFormRef.componentInstance.viewMode = true;
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
          this.openOperWsFormDialog();
          this.operWsFormRef.componentInstance.editForm(this.operationWasteId);
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
              this.operationWasteService
                .deleteOperationWaste(this.operationWasteId)
                .subscribe(() => this.refreshList(this.reportId));
            }
          });
        },
      },
    ];

    this.gridOptions = {
      gridHeight: '300px',
      enableFiltering: true,
      enableSorting: true,
      rowHeight: 35,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      checkboxSelector: {
        hideInFilterHeaderRow: true,
        hideInColumnTitleRow: true,
      },
    };
  }
}
