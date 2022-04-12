import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReceivedWasteModel } from '@models/reports/receiving-waste/received-waste.model';
import { ReceivedWasteService } from '@services/reports/receiving-waste/received-waste.service';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ReceivedWasteFormComponent } from './received-waste-form/received-waste-form.component';
@Component({
  selector: 'app-received-waste-list',
  templateUrl: './received-waste-list.component.html',
  styleUrls: ['./received-waste-list.component.scss'],
})
export class ReceivedWasteListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: ReceivedWasteModel[] = [];
  gridObj: any;
  dataViewObj: any;
  @Input() receivingWasteId!: number;
  receivedFormRef: any;
  receivedWasteId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private receivedWasteService: ReceivedWasteService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.receivingWasteId) this.refreshList(this.receivingWasteId);
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList(id: number) {
    this.receivedWasteService
      .getReceivedWasteListById(id)
      .subscribe((data: ReceivedWasteModel[]) => {
        this.dataset = data;
      });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.receivedWasteId = item.id;
  }

  openReceivedFormDialog() {
    this.receivedFormRef = this.dialog.open(ReceivedWasteFormComponent, {
      width: '600px',
    });

    this.onAddOrUpdateWasteReceived();
  }

  onAddOrUpdateWasteReceived() {
    this.receivedFormRef.componentInstance.addOrUpdateWasteReceived.subscribe({
      next: (data: ReceivedWasteModel) => {
        this.receivedWasteService
          .addOrUpdateReceivedWaste({
            ...data,
            receivingWasteId: this.receivingWasteId,
          })
          .subscribe(() => {
            this.receivedFormRef.close();
            this.refreshList(this.receivingWasteId);
          });
      },
    });
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
        name: 'Объем полученного отхода, (тонна)',
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
          this.openReceivedFormDialog();
          this.receivedFormRef.componentInstance.editForm(this.receivedWasteId);
          this.receivedFormRef.componentInstance.form.disable();
          this.receivedFormRef.componentInstance.viewMode = true;
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
          this.openReceivedFormDialog();
          this.receivedFormRef.componentInstance.editForm(this.receivedWasteId);
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
            this.receivedWasteService.deleteReceivedWaste(id).subscribe(() => {
              this.refreshList(this.receivingWasteId);
            });
          }
        },
      },
    ];

    this.gridOptions = {};
  }
}
