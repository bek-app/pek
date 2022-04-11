import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationWasteSenderModel } from '@models/reports/operation-waste/operation-waste.model';
import { OperationWasteSenderService } from '@services/reports/operation-waste/operation-waste-sender.service';
import { OperationWasteService } from '@services/reports/operation-waste/operation-waste.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { OperationWasteSenderFormComponent } from './operation-waste-sender-form/operation-waste-sender-form.component';
@Component({
  selector: 'app-operation-waste-sender',
  templateUrl: './operation-waste-sender.component.html',
  styleUrls: ['./operation-waste-sender.component.scss'],
})
export class OperationWasteSenderComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: OperationWasteSenderModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() operationWasteId!: number;
  operationWasteSenderId!: number;
  operWsSenderFormRef!: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private operationSenderService: OperationWasteSenderService,
    private operationWasteService: OperationWasteService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['operationWasteId'];
    this.operationWasteId = currentValue;

    if (currentValue) this.refreshList(currentValue);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(reportId: number) {
    this.operationSenderService
      .getOperationWasteSenderListByReportId(reportId)
      .subscribe(
        (operationWasteSender: OperationWasteSenderModel[]) =>
          (this.dataset = operationWasteSender)
      );
  }

  openOperWsSenderFormDialog() {
    this.operWsSenderFormRef = this.dialog.open(
      OperationWasteSenderFormComponent,
      {
        width: '900px',
      }
    );
    this.onOperationWasteSenderAdd();
  }

  onOperationWasteSenderAdd() {
    this.operWsSenderFormRef.componentInstance.operationWasteSenderAdd.subscribe(
      {
        next: (data: OperationWasteSenderModel) => {
          this.operationSenderService
            .addOperationWasteSender({
              ...data,
              operationWasteId: this.operationWasteId,
            })
            .subscribe(() => {
              this.operWsSenderFormRef.close();
              this.refreshList(this.operationWasteId);
            });
        },
      }
    );
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.operationWasteSenderId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'binTransferred',
        name: 'БИН организации',
        field: 'binTransferred',
        filterable: true,
        sortable: true,
      },
      {
        id: 'nameTransferred',
        name: 'Наименование организации',
        field: 'nameTransferred',
        filterable: true,
        sortable: true,
      },
      {
        id: 'dicWasteName',
        name: 'Вид отхода',
        field: 'dicWasteName',
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
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openOperWsSenderFormDialog();
          this.operWsSenderFormRef.componentInstance.form.disable();
          this.operWsSenderFormRef.componentInstance.viewMode = true;
          this.operWsSenderFormRef.componentInstance.editForm(
            this.operationWasteSenderId
          );
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
          this.openOperWsSenderFormDialog();
          this.operWsSenderFormRef.componentInstance.editForm(
            this.operationWasteSenderId
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
            this.operationSenderService
              .deleteOperationWasteSender(id)
              .subscribe(() => this.refreshList(this.operationWasteId));
          }
        },
      },
    ];
    this.gridOptions = {};
  }
}
