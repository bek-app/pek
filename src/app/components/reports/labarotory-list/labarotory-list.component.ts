import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { LabarotoryFormComponent } from './labarotory-form/labarotory-form.component';
import { LabarotoryModel } from '@models/reports/labarotory/labarotory.model';
import { LabarotoryService } from '@services/reports/labarotory/labarotory.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-labarotory-list',
  templateUrl: './labarotory-list.component.html',
  styleUrls: ['./labarotory-list.component.scss'],
})
export class LabarotoryListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: LabarotoryModel[] = [];
  gridObj: any;
  dataViewObj: any;
  reportId!: number;
  labId!: number;
  formDialogRef!: MatDialogRef<LabarotoryFormComponent>;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private labService: LabarotoryService,
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
    this.labService
      .getLabarotoryList(id)
      .subscribe((data: LabarotoryModel[]) => {
        console.log(data);

        this.dataset = data;
      });
  }

  openFormDialog() {
    this.formDialogRef = this.dialog.open(LabarotoryFormComponent, {
      width: '800px',
      data: { reportId: this.reportId },
    });
    this.formDialogRef
      .afterClosed()
      .subscribe(() => this.refreshList(this.reportId));
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.labId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'bin',
        name: 'БИН лаборатории',
        field: 'bin',
        filterable: true,
        sortable: true,
      },
      {
        id: 'orgName',
        name: 'Наименование лаборатории',
        field: 'orgName',
        filterable: true,
        sortable: true,
      },

      {
        id: 'regNumber',
        name: 'Номер действия аттестата аккредитации',
        field: 'regNumber',
        filterable: true,
        sortable: true,
      },

      {
        id: 'beginDate',
        name: 'Действия аттестата с',
        field: 'beginDate',
        filterable: true,
        sortable: true,
        formatter: Formatters.dateEuro,
      },
      {
        id: 'endDate',
        name: 'Действия аттестата до',
        field: 'endDate',
        filterable: true,
        sortable: true,
        formatter: Formatters.dateEuro,
      },
      {
        id: 'kindActitvity',
        name: 'Область аккредитации испытательной лаборатории',
        field: 'kindActitvity',
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
          this.formDialogRef.componentInstance.editForm(this.labId);
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
          this.formDialogRef.componentInstance.editForm(this.labId);
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
            this.labService.deleteLabarotory(id).subscribe(() => {
              this.refreshList(this.reportId);
            });
          }
        },
      },
    ];

    this.gridOptions = {};
  }
}
