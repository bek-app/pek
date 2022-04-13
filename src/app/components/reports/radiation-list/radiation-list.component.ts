import { RadiationFormComponent } from './radiation-form/radiation-form.component';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute, Router } from '@angular/router';
import { RadiationService } from '@services/reports/radiation/radiation.service';
import { RadiationModel } from '@models/reports/radiation/radiation.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-radiation-list',
  templateUrl: './radiation-list.component.html',
  styleUrls: ['./radiation-list.component.scss'],
})
export class RadiationListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: RadiationModel[] = [];
  gridObj: any;
  dataViewObj: any;
  radiationId!: number;
  reportId!: number;
  public formDialogRef!: MatDialogRef<RadiationFormComponent>;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private radiationService: RadiationService,
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

  openFormDialog() {
    this.formDialogRef = this.dialog.open(RadiationFormComponent, {
      width: '800px',
      data: { reportId: this.reportId },
    });
    this.formDialogRef
      .afterClosed()
      .subscribe(() => this.refreshList(this.reportId));
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.radiationId = item.id;
  }

  refreshList(id: number) {
    this.radiationService.getRadiationList(id).subscribe((data) => {
      this.dataset = data;
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'sourceName',
        name: ' Наименование источников воздействия',
        field: 'sourceName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'standartLimit',
        name: 'Установленный норматив(мкЗв/час)',
        field: 'standartLimit',
        filterable: true,
        sortable: true,
      },

      {
        id: 'actualVolume',
        name: ' Фактический результат мониторинга (мкЗв/час)',
        field: 'actualVolume',
        filterable: true,
        sortable: true,
      },

      {
        id: 'exceedingVolume',
        name: 'Превышение нормативов',
        field: 'exceedingVolume',
        filterable: true,
        sortable: true,
      },
      {
        id: 'correctiveMeasures',
        name: 'Мероприятия по устранению нарушения',
        field: 'correctiveMeasures',
        filterable: true,
        sortable: true,
      },
      {
        id: 'eliminationDeadline',
        name: 'Срок устранение',
        field: 'eliminationDeadline',
        filterable: true,
        sortable: true,
        formatter: Formatters.dateEuro,
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
          this.formDialogRef.componentInstance.editForm(this.radiationId);
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
          this.formDialogRef.componentInstance.editForm(this.radiationId);
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
            this.radiationService.deleteRadiation(id).subscribe(() => {
              this.refreshList(this.reportId);
            });
          }
        },
      },
    ];

    this.gridOptions = {};
  }
}
