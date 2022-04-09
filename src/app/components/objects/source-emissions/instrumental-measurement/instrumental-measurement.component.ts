import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';
import { SourceEmissionPollutantService } from '@services/objects/source-emission-pollutant.service';
import { SourceEmission } from '@models/objects/sources.model';
import { SourceEmissionPollutant } from '@models/objects/source-emission-pollutant.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@models/confirm-dialog.model';
import { InstrumentalMeasurementFormComponent } from './instrumental-measurement-form/instrumental-measurement-form.component';
import { PollutantsFormComponent } from '../pollutants-form/pollutants-form.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-instrumental-measurement',
  templateUrl: './instrumental-measurement.component.html',
  styleUrls: ['./instrumental-measurement.component.scss'],
})
export class InstrumentalMeasurementComponent implements OnInit, OnChanges {
  @Input() areaId!: number;
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: SourceEmission[] = [];
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  sourceEmissionId!: number;
  pollutantId!: number;
  instrumentalFormRef: any;
  pollutantFormRef: any;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }

  constructor(
    private sourceEmissionService: SourceEmissionsService,
    private sourceEmissionPollutantsService: SourceEmissionPollutantService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['areaId'];
    if (currentValue) {
      this.refreshList(currentValue);
      this.areaId = currentValue;
    }
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  goToEmissions(id: number): void {
    this.areaId = id;
    this.refreshList(id);
  }

  refreshList(id: number) {
    this.sourceEmissionService
      .getSourceEmissionList(id, 'ins')
      .subscribe((data: any) => {
        data.forEach((item: any) => {
          item.wasteList.forEach((r: any) => {
            const a = { sourceName: r.dicPollutantName };
            Object.assign(r, a);
          });
        });
        this.dataset = data;
      });
  }

  openInstrumentalDialog() {
    this.instrumentalFormRef = this.dialog.open(
      InstrumentalMeasurementFormComponent,
      {
        width: '800px',
      }
    );

    this.onSourceEmissionAdded();
    this.onSourceEmissionUpdated();
  }

  onSourceEmissionAdded() {
    this.instrumentalFormRef.componentInstance.onSourceCreate.subscribe({
      next: (data: SourceEmission) => {
        const sourceEmission = {
          ...data,
          areaEmissionId: this.areaId,
          discriminator: 'ins',
          isInstrumentMeasurement: true,
          isCalcMethod: false,
        };

        this.sourceEmissionService
          .addSourceEmission(sourceEmission)
          .subscribe(() => {
            this.instrumentalFormRef.close();
            this.refreshList(this.areaId);
          });
      },
    });
  }

  onSourceEmissionUpdated() {
    this.instrumentalFormRef.componentInstance.onSourceUpdated.subscribe({
      next: (data: SourceEmission) => {
        const sourceEmission = {
          id: this.sourceEmissionId,
          ...data,
          areaEmissionId: this.areaId,
          discriminator: 'ins',
          isInstrumentMeasurement: true,
          isCalcMethod: false,
        };

        this.sourceEmissionService
          .updateSourceEmission(sourceEmission)
          .subscribe(() => {
            this.instrumentalFormRef.close();
            this.refreshList(this.areaId);
          });
      },
    });
  }

  openPollutantsDialog() {
    this.pollutantFormRef = this.dialog.open(PollutantsFormComponent, {
      width: '800px',
    });

    this.pollutantAdded();
    this.pollutantUpdated();
  }

  pollutantAdded() {
    this.pollutantFormRef.componentInstance.onPollutantAdded.subscribe({
      next: (value: SourceEmissionPollutant) => {
        this.sourceEmissionPollutantsService
          .addPollutant({ sourceEmissionId: this.sourceEmissionId, ...value })
          .subscribe(() => {
            this.pollutantFormRef.close();
            this.refreshList(this.areaId);
          });
      },
    });
  }

  pollutantUpdated() {
    this.pollutantFormRef.componentInstance.onPollutantUpdated.subscribe({
      next: (value: SourceEmissionPollutant) => {
        this.sourceEmissionPollutantsService
          .updatePollutant({
            id: this.pollutantId,
            sourceEmissionId: this.sourceEmissionId,
            ...value,
          })
          .subscribe(() => {
            this.pollutantFormRef.close();
            this.refreshList(this.areaId);
          });
      },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'sourceName',
        name: 'Наименование Источника',
        field: 'sourceName',
        type: FieldType.string,
        width: 250,
        formatter: treeFormatter,
        filterable: true,
        sortable: true,
      },

      {
        id: 'standartLimitGS',
        name: '(г/с)',
        field: 'standartLimitGS',
        columnGroup: 'Установленный норматив по ПДВ, ОВОС',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        filter: { model: Filters.compoundInputNumber },
        formatter: (row, cell, value) => (isNaN(value) ? '' : `${value} г/с`),
      },
      {
        id: 'standartLimitTons',
        name: ' (тонн/год)',
        field: 'standartLimitTons',
        columnGroup: 'Установленный норматив по ПДВ, ОВОС',
        filterable: true,
        sortable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        filter: { model: Filters.compoundInputNumber },
        formatter: (row, cell, value) => (isNaN(value) ? '' : `${value} тонн`),
      },
      {
        id: 'projectCapacity',
        name: 'Проектная мощность',
        field: 'projectCapacity',
        filterable: true,
        sortable: true,
      },
      {
        id: 'measurementFullName',
        name: 'Периодичность',
        field: 'measurementFullName',
        filterable: true,
        sortable: true,
      },

      {
        id: 'edits',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: customEnableButtonFormatter,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          this.sourceEmissionId = id;
          if (args.dataContext.__hasChildren) {
            this.openPollutantsDialog();
          }
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
          const id = args.dataContext.id;
          this.sourceEmissionId = id;
          if (args.dataContext.__hasChildren) {
            this.openInstrumentalDialog();
            this.instrumentalFormRef.componentInstance.editForm(id);
            this.instrumentalFormRef.componentInstance.form.disable();
            this.instrumentalFormRef.componentInstance.viewMode = true;
          } else {
            this.openPollutantsDialog();
            this.pollutantFormRef.componentInstance.editForm(id);
            this.pollutantFormRef.componentInstance.form.disable();
            this.pollutantFormRef.componentInstance.viewMode = true;
          }
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
          this.sourceEmissionId = id;

          if (args.dataContext.__hasChildren) {
            this.openInstrumentalDialog();
            this.instrumentalFormRef.componentInstance.editForm(id);
          } else {
            this.openPollutantsDialog();
            this.pollutantFormRef.componentInstance.editForm(id);
            this.pollutantId = id;
          }
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
              if (args.dataContext.__hasChildren) {
                this.sourceEmissionService
                  .deleteSourceEmission(id)
                  .subscribe(() => {
                    this.refreshList(this.areaId);
                  });
              } else {
                this.sourceEmissionPollutantsService
                  .deletePollutant(id)
                  .subscribe(() => {
                    this.refreshList(this.areaId);
                  });
              }
            }
          });
        },
      },
    ];

    this.gridOptions = {
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: true,
        sanitizeDataExport: true,
      },

      registerExternalResources: [new ExcelExportService()],
      enableFiltering: true,
      enableTreeData: true,
      multiColumnSort: false,
      treeDataOptions: {
        columnId: 'sourceName',
        childrenPropName: 'wasteList',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering,
        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
        initialSort: {
          columnId: 'sourceName', // which column are we using to do the initial sort? it doesn't have to be the tree column, it could be any column
          direction: 'DESC',
        },
      },

      headerRowHeight: 35,
      rowHeight: 33,
      showCustomFooter: false,
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
      },
      contextMenu: {
        iconCollapseAllGroupsCommand: 'mdi mdi-arrow-collapse',
        iconExpandAllGroupsCommand: 'mdi mdi-arrow-expand',
        iconClearGroupingCommand: 'mdi mdi-close',
        iconCopyCellValueCommand: 'mdi mdi-content-copy',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
      },
      gridMenu: {
        iconCssClass: 'mdi mdi-menu',
        iconClearAllFiltersCommand: 'mdi mdi-filter-remove-outline',
        iconClearAllSortingCommand: 'mdi mdi-swap-vertical',
        iconExportCsvCommand: 'mdi mdi-download',
        iconExportExcelCommand: 'mdi mdi-file-excel-outline',
        iconExportTextDelimitedCommand: 'mdi mdi-download',
        iconRefreshDatasetCommand: 'mdi mdi-sync',
        iconToggleFilterCommand: 'mdi mdi-flip-vertical',
        iconTogglePreHeaderCommand: 'mdi mdi-flip-vertical',
      },
      headerMenu: {
        iconClearFilterCommand: 'mdi mdi mdi-filter-remove-outline',
        iconClearSortCommand: 'mdi mdi-swap-vertical',
        iconSortAscCommand: 'mdi mdi-sort-ascending',
        iconSortDescCommand: 'mdi mdi-flip-v mdi-sort-descending',
        iconColumnHideCommand: 'mdi mdi-close',
      },
    };
  }
}

const treeFormatter: Formatter = (
  _row,
  _cell,
  value,
  _columnDef,
  dataContext,
  grid
) => {
  const gridOptions = grid.getOptions() as GridOption;
  const treeLevelPropName =
    (gridOptions.treeDataOptions &&
      gridOptions.treeDataOptions.levelPropName) ||
    '__treeLevel';
  if (value === null || value === undefined || dataContext === undefined) {
    return '';
  }
  const dataView = grid.getData();
  const data = dataView.getItems();
  const identifierPropName = dataView.getIdPropertyName() || 'id';
  const idx = dataView.getIdxById(dataContext[identifierPropName]) as number;
  const prefix = getFileIcon(value);

  value = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const spacer = `<span style="display:inline-block; width:${
    15 * dataContext[treeLevelPropName]
  }px;"></span>`;

  if (
    data[idx + 1] &&
    data[idx + 1][treeLevelPropName] > data[idx][treeLevelPropName]
  ) {
    const folderPrefix = `<span class="mdi icon color-alt-warning ${
      dataContext.__collapsed ? 'mdi-folder' : 'mdi-folder-open'
    }"></span>`;
    if (dataContext.__collapsed) {
      return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
    } else {
      return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
    }
  } else {
    return `${spacer} <span class="slick-group-toggle" level="${dataContext[treeLevelPropName]}"></span>${prefix}&nbsp;${value}`;
  }
};
function getFileIcon(value: string) {
  let prefix = '';
  if (value.includes('.pdf')) {
    prefix = '<span class="mdi icon mdi-file-pdf-outline color-danger"></span>';
  } else if (value.includes('.txt')) {
    prefix =
      '<span class="mdi icon mdi-file-document-outline color-muted-light"></span>';
  } else if (value.includes('.xls')) {
    prefix =
      '<span class="mdi icon mdi-file-excel-outline color-success"></span>';
  } else if (value.includes('.mp3')) {
    prefix = '<span class="mdi icon mdi-file-music-outline color-info"></span>';
  }
  return prefix;
}

const customEnableButtonFormatter: Formatter<any> = (
  row,
  cell,
  value,
  columnDef,
  dataContext
) => {
  return dataContext.__hasChildren
    ? `<i class="fa fa-plus-circle pointer" style="font-size:17px"></i>`
    : '<i class="fa fa-circle" style="display: none;"></i>';
};
