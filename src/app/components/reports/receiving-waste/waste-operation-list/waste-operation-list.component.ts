import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WasteOperationModel } from '@models/reports/receiving-waste/waste-operation.model';
import { WasteOperationService } from '@services/reports/receiving-waste/waste-operation.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { WasteOperationFormComponent } from './waste-operation-form/waste-operation-form.component';
@Component({
  selector: 'app-waste-operation-list',
  templateUrl: './waste-operation-list.component.html',
  styleUrls: ['./waste-operation-list.component.scss'],
})
export default class WasteOperationListComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WasteOperationModel[] = [];
  gridObj: any;
  dataViewObj: any;
  wasteOperationFormRef: any;
  @Input() receivingWasteId!: number;
  wasteOperationId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private wasteOperationService: WasteOperationService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.receivingWasteId) this.refreshList(this.receivingWasteId);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wasteOperationService
      .getWasteOperationListById(id)
      .subscribe((data: WasteOperationModel[]) => {
        this.dataset = data;
      });
  }

  openWasteOperationFormDialog() {
    this.wasteOperationFormRef = this.dialog.open(WasteOperationFormComponent);
    this.onAddOrUpdateWasteOperation();
  }

  onAddOrUpdateWasteOperation() {
    console.log(this.wasteOperationFormRef);
    this.wasteOperationFormRef.componentInstance.addOrUpdateWasteOperation.subscribe(
      {
        next: (payload: WasteOperationModel) => {
          this.wasteOperationService
            .addOrUpdateWasteOperation({
              ...payload,
              receivingWasteId: this.receivingWasteId,
            })
            .subscribe(() => {
              this.wasteOperationFormRef.close();
              this.refreshList(this.receivingWasteId);
            });
        },
      }
    );
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.wasteOperationId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'dicKindOperationName',
        name: 'Вид операции',
        field: 'dicKindOperationName',
      },

      {
        id: 'transactionalVolume',
        name: 'Объем отхода, направленный на проведение операций с ним,(тонна)',
        field: 'transactionalVolume',
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
          this.openWasteOperationFormDialog();
          this.wasteOperationFormRef.componentInstance.editForm(
            this.wasteOperationId
          );
          this.wasteOperationFormRef.componentInstance.form.disable();
          this.wasteOperationFormRef.componentInstance.viewMode = true;
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
          this.openWasteOperationFormDialog();
          this.wasteOperationFormRef.componentInstance.editForm(
            this.wasteOperationId
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
            this.wasteOperationService
              .deleteWasteOperation(id)
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
