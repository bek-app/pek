import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { AccumulationWasteSenderModel } from '@models/reports/accumulation-waste/accumulation-waste-sender.model';
import { AccumulationWasteSenderService } from '@services/reports/accumulation-waste/accumulation-waste-sender.service';
import { AccumulationWasteService } from '@services/reports/accumulation-waste/accumulation-waste.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { AccumulationWasteSenderFormComponent } from './accumulation-waste-sender-form/accumulation-waste-sender-form.component';
@Component({
  selector: 'app-accumulation-waste-sender',
  templateUrl: './accumulation-waste-sender.component.html',
  styleUrls: ['./accumulation-waste-sender.component.scss'],
})
export class AccumulationWasteSenderComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: AccumulationWasteSenderModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() accWasteId!: number;
  senderId!: number;
  senderFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private accumulationWasteSenderService: AccumulationWasteSenderService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['accWasteId'];
    this.accWasteId = currentValue;
    if (this.accWasteId) this.refreshList(currentValue);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.accumulationWasteSenderService
      .getAccumulationWasteSenderListById(id)
      .subscribe(
        (data: AccumulationWasteSenderModel[]) => (this.dataset = data)
      );
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.senderId = item.id;
  }

  openSenderDialog() {
    this.senderFormRef = this.dialog.open(
      AccumulationWasteSenderFormComponent,
      {
        width: '800px',
      }
    );
    this.onAccWasteSenderAdd();
    this.onAccWasteSenderUpdate();
  }

  onAccWasteSenderAdd() {
    this.senderFormRef.componentInstance.accWasteSenderAdd.subscribe({
      next: (data: AccumulationWasteSenderModel) => {
        this.accumulationWasteSenderService
          .addAccumulationWasteSender({
            ...data,
            accumulationWasteId: this.accWasteId,
          })
          .subscribe(() => {
            this.senderFormRef.close();
            this.refreshList(this.accWasteId);
          });
      },
    });
  }

  onAccWasteSenderUpdate() {
    this.senderFormRef.componentInstance.accWasteSenderUpdate.subscribe({
      next: (data: AccumulationWasteSenderModel) => {
        this.accumulationWasteSenderService
          .updateAccumulationWasteSender({
            id: this.senderId,
            ...data,
            accumulationWasteId: this.accWasteId,
          })
          .subscribe(() => {
            this.senderFormRef.close();
            this.refreshList(this.accWasteId);
          });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'binTransferred',
        name: 'БИН ',
        field: 'binTransferred',
        filterable: true,
        sortable: true,
      },
      {
        id: 'nameTransferred',
        name: 'Наименование',
        field: 'nameTransferred',
        filterable: true,
        sortable: true,
      },

      {
        id: 'transferredVolume',
        name: 'Переданный объем (тонн)',
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
          this.openSenderDialog();
          this.senderFormRef.componentInstance.editForm(this.senderId);
          this.senderFormRef.componentInstance.form.disable();
          this.senderFormRef.componentInstance.viewMode = true;
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
          this.openSenderDialog();
          this.senderFormRef.componentInstance.editForm(this.senderId);
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
              this.accumulationWasteSenderService
                .deleteAccumulationWasteSender(this.senderId)
                .subscribe(() => {
                  this.refreshList(this.accWasteId);
                });
            }
          });
        },
      },
    ];
    this.gridOptions = {};
  }
}
