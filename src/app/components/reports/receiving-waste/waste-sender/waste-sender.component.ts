import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WasteSenderModel } from '@models/reports/receiving-waste/waste-sender.model';
import { WasteSenderService } from '@services/reports/receiving-waste/waste-sender.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { WasteSenderFormComponent } from './waste-sender-form/waste-sender-form.component';
@Component({
  selector: 'app-waste-sender',
  templateUrl: './waste-sender.component.html',
  styleUrls: ['./waste-sender.component.scss'],
})
export class WasteSenderComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WasteSenderModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() receivingWasteId!: number;
  formDialogRef: any;
  wasteSenderId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private wasteSenderService: WasteSenderService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.receivingWasteId) this.refreshList(this.receivingWasteId);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wasteSenderService
      .getWasteSenderListById(id)
      .subscribe((data: WasteSenderModel[]) => {
        this.dataset = data;
      });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.wasteSenderId = item.id;
  }

  openFormDialog() {
    this.formDialogRef = this.dialog.open(WasteSenderFormComponent, {
      width: '600px',
      data: { receivingWasteId: this.receivingWasteId },
    });
    this.formDialogRef
      .afterClosed()
      .subscribe(() => this.refreshList(this.receivingWasteId));
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'binTransferred',
        name: 'БИН организации ',
        field: 'binTransferred',
        filterable: true,
        sortable: true,
      },
      {
        id: 'nameTransferred',
        name: 'Наименование организации ',
        field: 'nameTransferred',
      },

      {
        id: 'transferredVolume',
        name: 'Переданный объем отхода, после операции с ними, тонна',
        field: 'transferredVolume',
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
          this.formDialogRef.componentInstance.editForm(this.wasteSenderId);
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
          this.formDialogRef.componentInstance.editForm(this.wasteSenderId);
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
            this.wasteSenderService.deleteWasteSender(id).subscribe(() => {
              this.refreshList(this.receivingWasteId);
            });
          }
        },
      },
    ];

    this.gridOptions = {};
  }
}
