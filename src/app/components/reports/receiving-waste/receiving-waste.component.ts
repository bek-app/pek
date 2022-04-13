import { Component, Input, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceivingWasteModel } from '@models/reports/receiving-waste/receiving-waste.model';
import { ReceivingWasteService } from '@services/reports/receiving-waste/receiving-waste.service';
import { MatDialog } from '@angular/material/dialog';
import { ReceivingWasteFormComponent } from './receiving-waste-form/receiving-waste-form.component';
@Component({
  selector: 'app-receiving-waste',
  templateUrl: './receiving-waste.component.html',
  styleUrls: ['./receiving-waste.component.scss'],
})
export class ReceivingWasteComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: ReceivingWasteModel[] = [];
  gridObj: any;
  dataViewObj: any;
  reportId!: number;
 receivingWasteId!: number;
  recevingWasteFormRef: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private receivingWasteService: ReceivingWasteService,
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

  refreshList(id: number) {
    this.receivingWasteService
      .getReceivingWasteListByReportId(id)
      .subscribe((data: ReceivingWasteModel[]) => {
        this.dataset = data;
      });
  }

  openReceivingWasteFormDialog(): void {
    this.recevingWasteFormRef = this.dialog.open(ReceivingWasteFormComponent, {
      width: '800px',
    });
    this.onAddOrUpdateReceivingWaste();
  }

  onAddOrUpdateReceivingWaste() {
    this.recevingWasteFormRef.componentInstance.addOrUpdateReceivingWaste.subscribe(
      {
        next: (data: ReceivingWasteModel) => {
          this.receivingWasteService
            .addOrUpdateReceivingWaste({ ...data, reportId: this.reportId })
            .subscribe(() => {
              this.recevingWasteFormRef.close();
              this.refreshList(this.reportId);
            });
        },
      }
    );
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.receivingWasteId = item.id;
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
        id: 'transferredVolume',
        name: 'Объем полученного отхода, (тонна)',
        field: 'transferredVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'transactionalVolume',
        name: 'Объем отхода, направленный на проведение операций с ним,(тонна)',
        field: 'transactionalVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'generatedVolume',
        name: ' Объем образованного отхода после проведения операции с изначальным видом отхода, (тонна)',
        field: 'generatedVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'reoperationVolume',
        name: ' Объем отхода, направленный на проведение повторной операций с ними,(тонна)',
        field: 'reoperationVolume',
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
          this.openReceivingWasteFormDialog();
          this.recevingWasteFormRef.componentInstance.editForm(
            this.receivingWasteId
          );
          this.recevingWasteFormRef.componentInstance.form.disable();
          this.recevingWasteFormRef.componentInstance.viewMode = true;
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
          this.openReceivingWasteFormDialog();
          this.recevingWasteFormRef.componentInstance.editForm(
            this.receivingWasteId
          );
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
          if (confirm('Are you sure?')) {
            this.receivingWasteService
              .deleteReceivingWaste(id)
              .subscribe(() => {
                this.refreshList(this.reportId);
              });
          }
        },
      },
    ];

    this.gridOptions = {
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
