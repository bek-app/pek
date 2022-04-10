import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportModel } from '@models/reports/report.model';
import { ReportFormComponent } from './report-form/report-form.component';
import { ReportService } from '@services/reports/report.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: ReportModel[] = [];
  gridObj: any;
  dataViewObj: any;
  reportId!: number;
  reportFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    this.changeDurationBackgroundColor();
  }

  changeDurationBackgroundColor() {
    this.dataViewObj.getItemMetadata = this.updateItemMetadata(
      this.dataViewObj.getItemMetadata
    );
    this.gridObj.invalidate();
    this.gridObj.render();
  }

  updateItemMetadata(previousItemMetadata: any) {
    const newCssClass = 'bg-success text-white fw-bold';
    const class2 = 'fw-bold';
    return (rowNumber: number) => {
      const item = this.dataViewObj.getItem(rowNumber);
      let meta = {
        cssClasses: '',
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }
      if (meta && item) {
        if (item.statusId == 2) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        } else {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + class2;
        }
      }
      return meta;
    };
  }

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.defineGrid();
    this.refreshList();
  }

  refreshList() {
    this.reportService.getReportList().subscribe((data: ReportModel[]) => {
      this.dataset = data;
    });
  }

  openReportDialog() {
    this.reportFormRef = this.dialog.open(ReportFormComponent, {
      width: '800px',
    });
    this.onReportAdd();
    this.onReportUpdate();
  }

  onReportAdd() {
    this.reportFormRef.componentInstance.addReport.subscribe({
      next: (value: ReportModel) => {
        const data = {
          ...value,
          userId: 1,
          statusId: 1,
        };

        this.reportService.addReport(data).subscribe({
          next: (result) => {
            this.reportFormRef.close();
            this.router.navigate(['../reports', result.modelId], {
              relativeTo: this.route,
            });
          },
          error: () => {
            this.reportFormRef.close();
            alert('Отчет за указанный период и объект уже зарегистрирован');
          },
        });
      },
    });
  }

  onReportUpdate() {
    this.reportFormRef.componentInstance.updateReport.subscribe({
      next: (value: ReportModel) => {
        const data = { id: this.reportId, ...value, userId: 1, statusId: 1 };

        this.reportService.updateReport(data).subscribe({
          next: (result) => {
            this.reportFormRef.close();
            this.router.navigate(['../reports', result.modelId], {
              relativeTo: this.route,
            });
          },
          error: () => {
            this.reportFormRef.close();
            alert('Отчет за указанный период и объект уже зарегистрирован');
          },
        });
      },
    });
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.reportId = item.id;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'reportYear',
        name: 'Годовой отчет',
        field: 'reportYear',
        filterable: true,
        sortable: true,
      },
      {
        id: 'objectName',
        name: 'Наименование Обьекта',
        field: 'objectName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'kvartal',
        name: 'Квартал',
        field: 'kvartal',
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
        id: 'statusName',
        name: 'Статус',
        field: 'statusName',
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
        id: 'view',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-eye pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.openReportDialog();
          this.reportFormRef.componentInstance.disable();
          this.reportFormRef.componentInstance.editForm(this.reportId);
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
          this.reportId = args.dataContext.id;
          this.router.navigate(['../reports', this.reportId], {
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
          this.openReportDialog();
          this.reportFormRef.componentInstance.editForm(this.reportId);
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
              if (args.dataContext.statusId !== 2) {
                this.reportService.deleteReport(id).subscribe(() => {
                  this.refreshList();
                });
              }
            }
          });
        },
      },
    ];

    this.gridOptions = {
      enableFiltering: true,
    };
  }
}
