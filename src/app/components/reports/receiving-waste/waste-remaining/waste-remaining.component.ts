import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WasteRemainingModel } from '@models/reports/receiving-waste/waste-remaining.model';
import { WasteRemainingService } from '@services/reports/receiving-waste/waste-remaining.service';
import { WasteRemainingFormComponent } from './waste-remaining-form/waste-remaining-form.component';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
@Component({
  selector: 'app-waste-remaining',
  templateUrl: './waste-remaining.component.html',
  styleUrls: ['./waste-remaining.component.scss'],
})
export class WasteRemainingComponent implements OnInit, OnChanges {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: WasteRemainingModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input()  receivingWasteId!: number;
  remainingWasteId!: number;
  formDialogRef!: MatDialogRef<WasteRemainingFormComponent>;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private wasteRemainingService: WasteRemainingService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.receivingWasteId) this.refreshList(this.receivingWasteId);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.wasteRemainingService
      .getWasteRemainingListById(id)
      .subscribe((data) => {
        this.dataset = data;
      });
  }

  openFormDialog() {
    this.formDialogRef = this.dialog.open(WasteRemainingFormComponent, {
      data: { receivingWasteId: this.receivingWasteId },
    });

    this.formDialogRef
      .afterClosed()
      .subscribe(() => this.refreshList(this.receivingWasteId));
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.remainingWasteId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'binRemaining',
        name: 'БИН организации ',
        field: 'binRemaining',
        filterable: true,
        sortable: true,
      },
      {
        id: 'nameRemaining',
        name: 'Наименование',
        field: 'nameRemaining',
      },
      {
        id: 'remainingVolume',
        name: 'объем переданных отходов, (тонна)',
        field: 'remainingVolume',
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
          this.formDialogRef.componentInstance.editForm(this.remainingWasteId);
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
          this.formDialogRef.componentInstance.editForm(this.remainingWasteId);
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
            this.wasteRemainingService
              .deleteWasteRemaining(id)
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
