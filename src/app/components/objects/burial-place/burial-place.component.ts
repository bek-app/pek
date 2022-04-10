import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Params } from '@angular/router';
import { BurialPlaceFormComponent } from './burial-place-form/burial-place-form.component';
import { BurialPlaceModel } from '@models/objects/burial-place/burial-place.model';
import { MatDialog } from '@angular/material/dialog';
import { BurialPlaceService } from '@services/objects/burial-place/burial-place.service';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-burial-place',
  templateUrl: './burial-place.component.html',
  styleUrls: ['./burial-place.component.scss'],
})
export class BurialPlaceComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: BurialPlaceModel[] = [];
  gridObj: any;
  dataViewObj: any;
  burialPlaceId!: number;
  objectId!: number;
  burialPlaceFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private burialPlaceService: BurialPlaceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((param: Params) => {
      this.objectId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.defineGrid();
    this.refreshList(this.objectId);
  }

  refreshList(id: number) {
    this.burialPlaceService
      .getBurialPlaceList(id)
      .subscribe((data: BurialPlaceModel[]) => {
        this.dataset = data;
      });
  }
  openBurialPlaceDialog() {
    this.burialPlaceFormRef = this.dialog.open(BurialPlaceFormComponent, {
      width: '60%',
    });
    this.onAddBurialPlace();
    this.onUpdateBurialPlace();
  }

  onAddBurialPlace() {
    this.burialPlaceFormRef.componentInstance.addBurialPlace.subscribe({
      next: (value: BurialPlaceModel) => {
        this.burialPlaceService
          .addBurialPlace({ ...value, pekObjectId: this.objectId })
          .subscribe(() => {
            this.burialPlaceFormRef.close();
            this.refreshList(this.objectId);
          });
      },
    });
  }

  onUpdateBurialPlace() {
    this.burialPlaceFormRef.componentInstance.updateBurialPlace.subscribe({
      next: (value: BurialPlaceModel) => {
        const data = {
          id: this.burialPlaceId,
          ...value,
          pekObjectId: this.objectId,
        };
        this.burialPlaceService.updateBurialPlace(data).subscribe(() => {
          this.burialPlaceFormRef.close();
          this.refreshList(this.objectId);
        });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'nameObject',
        name: 'Наименование',
        field: 'nameObject',
        filterable: true,
        sortable: true,
      },

      {
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer" ></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.burialPlaceId = args.dataContext.id;
          this.openBurialPlaceDialog();
          this.burialPlaceFormRef.componentInstance.form.disable();
          this.burialPlaceFormRef.componentInstance.editForm(
            this.burialPlaceId
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
          this.burialPlaceId = args.dataContext.id;
          this.openBurialPlaceDialog();
          this.burialPlaceFormRef.componentInstance.editForm(
            this.burialPlaceId
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
              this.burialPlaceService.deleteBurialPlace(id).subscribe(() => {
                this.refreshList(this.objectId);
              });
            }
          });
        },
      },
    ];

    this.gridOptions = {};
  }
}
