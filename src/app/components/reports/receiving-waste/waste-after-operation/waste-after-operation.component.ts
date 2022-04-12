import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WasteAfterOperationModel } from '@models/reports/receiving-waste/waste-after-operation.model';
import { WasteAfterOperationService } from '@services/reports/receiving-waste/waste-after-operation.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { WasteAfterOperationFormComponent } from './waste-after-operation-form/waste-after-operation-form.component';
@Component({
  selector: 'app-waste-after-operation',
  templateUrl: './waste-after-operation.component.html',
  styleUrls: ['./waste-after-operation.component.scss'],
})
export class WasteAfterOperationComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WasteAfterOperationModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() receivingWasteId!: number;
  afterOperationId!: number;
  formDialogRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private dialog: MatDialog,
    private wasteAfterOperationService: WasteAfterOperationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.receivingWasteId) this.refreshList(this.receivingWasteId);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wasteAfterOperationService
      .getWasteAfterOperationListById(id)
      .subscribe((data: WasteAfterOperationModel[]) => {
        this.dataset = data;
      });
  }

  openFormDialog() {
    this.formDialogRef = this.dialog
      .open(WasteAfterOperationFormComponent, {
        data: { receivingWasteId: this.receivingWasteId },
      })
      .afterClosed()
      .subscribe(() => this.refreshList(this.receivingWasteId));
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.afterOperationId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'dicWasteName',
        name: 'Вид образованного отхода после проведения операции с изначальным видом отхода',
        field: 'dicWasteName',
      },

      {
        id: 'dicKindOperationName',
        name: 'Вид операции с образованным после проведения операции отхода',
        field: 'dicKindOperationName',
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
          this.openFormDialog();
          this.formDialogRef.componentInstance.editForm(this.afterOperationId);
          this.formDialogRef.componentInstance.form.disable();
          this.formDialogRef.componentInstance.viewMode = true;
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
          this.openFormDialog();
          this.formDialogRef.componentInstance.editForm(this.afterOperationId);
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
            this.wasteAfterOperationService
              .deleteWasteAfterOperation(id)
              .subscribe(() => {
                this.refreshList(this.receivingWasteId);
              });
          }
        },
      },
    ];

    this.gridOptions = {};
  }
}
