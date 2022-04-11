import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { BurialWasteFormComponent } from './burial-waste-form/burial-waste-form.component';
import { BurialWasteModel } from '@models/objects/burial-place/burial-waste.model';
import { BurialWasteService } from '@services/objects/burial-place/burial-waste.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-burial-waste',
  templateUrl: './burial-waste.component.html',
  styleUrls: ['./burial-waste.component.scss'],
})
export class BurialWasteComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: BurialWasteModel[] = [];
  gridObj: any;
  dataViewObj: any;
  burialWasteId!: number;
  burialWasteFormRef: any;
  reportId!: number;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private burialService: BurialWasteService,
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
    this.burialService
      .getBurialWasteList(id)
      .subscribe((burialWasteList: BurialWasteModel[]) => {
        this.dataset = burialWasteList;
      });
  }

  openBurialWasteFormDialog() {
    this.burialWasteFormRef = this.dialog.open(BurialWasteFormComponent, {
      width: '800px',
      data: { reportId: this.reportId },
    });

    this.onBurialWasteAddOrUpdate();
  }

  onBurialWasteAddOrUpdate() {
    this.burialWasteFormRef.componentInstance.burialWasteAddOrUpdate.subscribe({
      next: (payload: BurialWasteModel) => {
        const data = {
          ...payload,
          reportId: this.reportId,
        };
        this.burialService.burialWasteAddOrUpdate(data).subscribe(() => {
          this.burialWasteFormRef.close();
          this.refreshList(this.reportId);
        });
      },
    });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.burialWasteId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'wasteName',
        name: 'Вид отхода',
        field: 'wasteName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'burialLimit',
        name: ' Лимит захоронения отходов (тонн)',
        field: 'burialLimit',
        filterable: true,
        sortable: true,
      },
      {
        id: 'generatedVolume',
        name: 'Образованный объем (тонн) ',
        field: 'generatedVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'burialVolume',
        name: 'Захороненный объем отходов (тонн)',
        field: 'burialVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'actualVolume',
        name: 'Фактический объем (тонн)',
        field: 'actualVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'placeNames',
        name: ' Месторасположение',
        field: 'placeNames',
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
          this.openBurialWasteFormDialog();
          this.burialWasteFormRef.componentInstance.editForm(
            this.burialWasteId
          );
          this.burialWasteFormRef.componentInstance.form.disable();
          this.burialWasteFormRef.componentInstance.viewMode = true;
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
          this.openBurialWasteFormDialog();
          this.burialWasteFormRef.componentInstance.editForm(
            this.burialWasteId
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
            this.burialService
              .deleteBurialWaste(id)
              .subscribe(() => this.refreshList(this.reportId));
          }
        },
      },
    ];

    this.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
    };
  }
}
