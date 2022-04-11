import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { AccumulationWasteModel } from '@models/reports/accumulation-waste/accumulation-waste.model';
import { AccumulationWasteService } from '@services/reports/accumulation-waste/accumulation-waste.service';
import { MatDialog } from '@angular/material/dialog';
 import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AccumulationWasteFormComponent } from './accumulation-waste-form/accumulation-waste-form.component';
@Component({
  selector: 'app-accumulation-waste',
  templateUrl: './accumulation-waste.component.html',
  styleUrls: ['./accumulation-waste.component.scss'],
})
export class AccumulationWasteComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: AccumulationWasteModel[] = [];
  gridObj: any;
  dataViewObj: any;
  accWasteId!: number;
  reportId!: number;
  accWasteFormRef!: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private accumulationService: AccumulationWasteService,
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
    this.accWasteId = item.id;
  }

  refreshList(id: number) {
    this.accumulationService
      .getAccumulationWasteListByReportId(id)
      .subscribe((data: AccumulationWasteModel[]) => (this.dataset = data));
  }

  openAccWasteDialog() {
    this.accWasteFormRef = this.dialog.open(AccumulationWasteFormComponent, {
      width: '75%',
      data: { reportId: this.reportId },
    });
    this.onAccumulationWasteAdd();
    this.onAccumulationWasteUpdate();
  }

  onAccumulationWasteAdd() {
    this.accWasteFormRef.componentInstance.accumulationWasteAdd.subscribe({
      next: (data: AccumulationWasteModel) => {
        this.accumulationService
          .addAccumulationWaste({ ...data, reportId: this.reportId })
          .subscribe(() => {
            this.accWasteFormRef.close();
            this.refreshList(this.reportId);
          });
      },
    });
  }

  onAccumulationWasteUpdate() {
    this.accWasteFormRef.componentInstance.accumulationWasteUpdate.subscribe({
      next: (data: AccumulationWasteModel) => {
        this.accumulationService
          .updateAccumulationWaste({
            id: this.accWasteId,
            ...data,
            reportId: this.reportId,
          })
          .subscribe(() => {
            this.accWasteFormRef.close();
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
        nameKey: 'ACCUMULATION_WASTE.FORM.WASTE',
        filterable: true,
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        params: { useFormatterOuputToFilter: true },
      },
      {
        id: 'storageLimit',
        name: 'Лимит накопления отходов (тонн)',
        field: 'storageLimit',
        nameKey: 'ACCUMULATION_WASTE.FORM.STORAGE_LIMIT',
        filterable: true,
        sortable: true,
      },
      {
        id: 'beginBalance',
        name: 'Остаток на начало (тонн)',
        field: 'beginBalance',
        nameKey: 'ACCUMULATION_WASTE.FORM.BEGIN_BALANCE',
        filterable: true,
        sortable: true,
      },
      {
        id: 'measurementFullName',
        name: 'Срок накопления  ',
        field: 'measurementFullName',
        nameKey: 'ACCUMULATION_WASTE.FORM.MEASUREMENT_VALUE',
        filterable: true,
        sortable: true,
      },
      {
        id: 'generatedVolume',
        name: 'Образованный объем (тонн)',
        nameKey: 'ACCUMULATION_WASTE.FORM.GENERATED_VOLUME',
        field: 'generatedVolume',
        filterable: true,
        sortable: true,
      },

      {
        id: 'actualVolume',
        name: 'Фактический объем (тонн)',
        field: 'actualVolume',
        nameKey: 'ACCUMULATION_WASTE.FORM.ACTUAL_VOLUME',
        filterable: true,
        sortable: true,
      },
      {
        id: 'transferredVolume',
        name: 'Переданный объем (тонн)',
        field: 'transferredVolume',
        nameKey: 'ACCUMULATION_WASTE.FORM.TRANSFERRED_VOLUME',
        filterable: true,
        sortable: true,
      },
      {
        id: 'operationVolume',
        name: 'Объем проведенных операции (тонн)',
        field: 'operationVolume',
        nameKey: 'ACCUMULATION_WASTE.FORM.OPERATION_VOLUME',
        filterable: true,
        sortable: true,
      },
      {
        id: 'binTransferred',
        name: 'БИН',
        field: 'binTransferred',
        nameKey: 'ACCUMULATION_WASTE.FORM.BIN_TRANSFERRED',
        filterable: true,
        sortable: true,
      },
      {
        id: 'endBalance',
        name: ' Остаток отходов в накопителе (тонн)',
        field: 'endBalance',
        nameKey: 'ACCUMULATION_WASTE.FORM.END_BALANCE',
        filterable: true,
        sortable: true,
      },
      {
        id: 'placeNames',
        name: 'Месторасположение',
        field: 'placeNames',
        nameKey: 'ACCUMULATION_WASTE.FORM.PLACES',
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
          this.openAccWasteDialog();
          this.accWasteFormRef.componentInstance.editForm(this.accWasteId);
          this.accWasteFormRef.componentInstance.form.disable();
          this.accWasteFormRef.componentInstance.viewMode = true;
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
          this.openAccWasteDialog();
          this.accWasteFormRef.componentInstance.editForm(this.accWasteId);
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
              this.accumulationService
              .deleteAccumulationWaste(id)
              .subscribe(() => {
                this.refreshList(this.reportId);
              });
            }
          });

        },
      },
    ];

    this.gridOptions = {
      gridHeight: '200px',
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
