import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ObjectModel } from '@models/objects/object.model';
import { ObjectsService } from '@services/objects/objects.service';
import { ObjectFormComponent } from './object-form/object-form.component';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.scss'],
})
export class ObjectListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: ObjectModel[] = [];
  gridObj: any;
  dataViewObj: any;
  objectId!: number;
  objectFormRef: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private objectsService: ObjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshList();
    this.defineGrid();
  }

  refreshList() {
    this.objectsService.getObjects().subscribe((data) => {
      this.dataset = data;
    });
  }

  openObjectDialog() {
    this.objectFormRef = this.dialog.open(ObjectFormComponent);
    this.onObjectAdded();
    this.onObjectUpdated();
  }

  onObjectAdded() {
    this.objectFormRef.componentInstance.objectCreated.subscribe({
      next: (data: ObjectModel) => {
        this.objectsService.addObject(data).subscribe({
          next: () => {
            this.objectFormRef.close();
            this.refreshList();
          },
        });
      },
    });
  }

  onObjectUpdated() {
    this.objectFormRef.componentInstance.objectUpdated.subscribe({
      next: (data: ObjectModel) => {
        this.objectsService
          .updateObject({ id: this.objectId, ...data })
          .subscribe({
            next: () => {
              this.objectFormRef.close();
              this.refreshList();
            },
          });
      },
    });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.objectId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'nameObject',
        name: 'Наименование Обьекта',
        field: 'nameObject',
        filterable: true,
        sortable: true,
      },
      {
        id: 'oblastName',
        name: 'Область',
        field: 'oblastName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'regionName',
        name: 'Город',
        field: 'regionName',
        filterable: true,
        sortable: true,
      },

      {
        id: 'subRegionName',
        name: 'Сельский округ',
        field: 'subRegionName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'villageName',
        name: 'Село',
        field: 'villageName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'address',
        name: 'Адресс',
        field: 'address',
        filterable: true,
        sortable: true,
      },
      {
        id: 'inactive',
        name: 'Ликвидирован',
        field: 'inactive',
        filterable: true,
        type: FieldType.boolean,
        sortable: true,
        exportCustomFormatter: Formatters.complexObject,
        formatter: Formatters.multiple,
        params: {
          formatters: [Formatters.complexObject, Formatters.checkmark],
        },
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
          this.openObjectDialog();
          this.objectFormRef.componentInstance.editForm(this.objectId);
          this.objectFormRef.componentInstance.form.disable();
          this.objectFormRef.componentInstance.viewMode = true;
        },
      },
      {
        id: 'action',
        field: 'action',
        minWidth: 30,
        maxWidth: 30,
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-cog" style="cursor:pointer;"></i>`,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          this.router.navigate(['../objects', id], {
            relativeTo: this.route,
          });
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
          const id = args.dataContext.id;
          this.openObjectDialog();
          this.objectFormRef.componentInstance.editForm(id);
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
              this.objectsService.deleteObject(id).subscribe(() => {
                this.refreshList();
              });
            }
          });
        },
      },
    ];

    this.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
    };
  }
}
