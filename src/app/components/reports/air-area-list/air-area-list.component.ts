import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Editors,
  FieldType,
  Filters,
  Formatter,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { AirMeasureMethodService } from '@services/reports/air/air-measure-method.service';
import { AirMeasureMethodModel } from '@models/reports/air/air-measure-method.model';
@Component({
  selector: 'app-air-area-list',
  templateUrl: './air-area-list.component.html',
  styleUrls: ['./air-area-list.component.scss'],
})
export class AirAreaListComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: AirMeasureMethodModel[] = [];
  gridObj: any;
  dataViewObj: any;
  reportId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    // this.dataViewObj.getItemMetadata = (row: any) => {
    //   const item = this.dataViewObj.getItem(row);
    //   console.log(item);

    //   if (!item.__parentId) {
    //     return { cssClasses: 'bg-primary text-white' };
    //   } else {
    //     return {
    //       cssClasses: '',
    //     };
    //   }
    // };
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false;
      } else {
        return true;
      }
    });
  }

  constructor(
    private airMeasureMethodService: AirMeasureMethodService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((param) => {
      this.reportId = +param['id'];
    });
  }

  ngOnInit(): void {
    this.defineGrid();
    this.refreshList(this.reportId);
  }

  refreshList(id: number): void {
    this.airMeasureMethodService
      .getAirMeasureMethodLists(id, 'ins')
      .subscribe((data) => {
        let list: any[];
        data.forEach((item: any) => {
          item.source.forEach((r: any) => {
            const a = { areaName: r.sourceName, source: r.pollutants };
            Object.assign(r, a);
            r.pollutants.forEach((pollutant: any) => {
              const b = { areaName: pollutant.dicPollutantName };
              Object.assign(pollutant, b);
            });
            list = [
              {
                id: new Date().getTime() + Math.random(),
                areaName: 'Загрязняющее вещество',
                source: [...r.pollutants],
              },
            ];

            Object.assign(r, {
              areaName: r.sourceName,
              source: list,
            });
          });
        });
        this.dataset = data;
      });
  }

  onCellChanged(e: Event, args: OnEventArgs) {
    const metadata =
      this.angularGrid.gridService.getColumnFromEventArguments(args);

    const { id } = metadata.dataContext;
    const { field } = metadata.columnDef;

    for (let item in metadata.dataContext) {
      if (field === item) {
        let nameField = item[0].toUpperCase() + item.slice(1);
        let valueField = metadata.dataContext[item];
        if (typeof valueField === 'object') {
          return;
        }

        const data = {
          id,
          nameField,
          valueField: valueField.toString(),
        };

        this.airMeasureMethodService
          .addAirMeasureMethod(data)
          .subscribe((res: any) => {});
      }
    }
  }

  reasonFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    if (dataContext.dicPollutantId && value === null) {
      return `<div class="d-flex justify-content-between"> ...<i class="bi bi-pen"> </i>  </div>`;
    } else if (dataContext.dicPollutantId) {
      return `<div class="d-flex justify-content-between"> <i>${value}</i> <i class="bi bi-pen"> </i>  </div>`;
    } else if (dataContext.dicMaterialId) {
      return { addClasses: 'bg-secondary bg-opacity-50', text: '' };
    } else return { addClasses: '', text: '' };
  };

  aboveVolumeTonsFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    if (!dataContext.dicPollutantId && !dataContext.dicMaterialId) {
      return '';
    } else if (dataContext.standartLimitTons < dataContext.actualVoumeTons) {
      return { addClasses: 'bg-danger text-white', text: value };
    } else {
      return { addClasses: 'bg-secondary bg-opacity-50 text-white', text: '' };
    }
  };

  standartLimitFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    if (dataContext.dicPollutantId) {
      return {
        addClasses: 'bg-secondary bg-opacity-50 text-white',
        text: value,
      };
    } else if (dataContext.dicMaterialId) {
      return { addClasses: 'bg-secondary bg-opacity-50', text: '' };
    } else return '';
  };

  projectCapacityFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    if (dataContext.projectCapacity) {
      return {
        addClasses: 'bg-secondary bg-opacity-50 text-white',
        text: value,
      };
    } else if (dataContext.dicPollutantId) {
      return { addClasses: 'bg-secondary bg-opacity-50', text: '' };
    } else return '';
  };

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'areaName',
        name: 'Наименование Площадка',
        field: 'areaName',
        type: FieldType.string,
        width: 200,
        formatter: treeFormatter,
        filterable: true,
        sortable: true,
      },
      {
        id: 'standartLimitTons',
        name: ' (тонн/год)',
        field: 'standartLimitTons',
        columnGroup: 'Установленный норматив по ПДВ, ОВОС',
        formatter: this.standartLimitFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        filter: { model: Filters.compoundInputNumber },
      },
      {
        id: 'standartLimitGS',
        name: '(г/с)',
        field: 'standartLimitGS',
        columnGroup: 'Установленный норматив по ПДВ, ОВОС',
        formatter: this.standartLimitFormatter,
        filterable: true,
        sortable: true,
        type: FieldType.number,
        exportWithFormatter: true,
        filter: { model: Filters.compoundInputNumber },
      },

      {
        id: 'actualVoumeTons',
        name: 'тонн /год',
        field: 'actualVoumeTons',
        columnGroup: 'Фактический результат',
        type: FieldType.number,
        editor: { model: Editors.integer, placeholder: 'тонн /год' },
        formatter: this.reasonFormatter,
        filterable: true,
        sortable: true,
      },
      {
        id: 'actualVoumeGS',
        name: 'г/с',
        field: 'actualVoumeGS',
        columnGroup: 'Фактический результат',
        type: FieldType.number,
        editor: { model: Editors.integer, placeholder: 'г/с' },
        formatter: this.reasonFormatter,
        filterable: true,
        sortable: true,
      },
      {
        id: 'aboveVoumeTons',
        name: 'Превышение нормативов (ПДВ)',
        field: 'aboveVoumeTons',
        formatter: this.aboveVolumeTonsFormatter,
        type: FieldType.string,
        filterable: true,
        sortable: true,
      },
      {
        id: 'reason',
        name: 'Мероприятия по устранению нарушения',
        field: 'reason',
        type: FieldType.string,
        formatter: this.reasonFormatter,
        editor: { model: Editors.text },
        filterable: true,
        sortable: true,
      },
      {
        id: 'projectCapacity',
        name: 'Проектная мощность',
        field: 'projectCapacity',
        formatter: this.projectCapacityFormatter,
        filterable: true,
        sortable: true,
      },
    ];

    this.gridOptions = {
      enableFiltering: true,
      enableTreeData: true,
      multiColumnSort: false,
      treeDataOptions: {
        columnId: 'areaName',
        childrenPropName: 'source',
        excludeChildrenWhenFilteringTree: false,
        autoApproveParentItemWhenTreeColumnIsValid: true,
        initialSort: {
          columnId: 'areaName',
          direction: 'DESC',
        },
      },

      headerRowHeight: 55,
      rowHeight: 55,
      showCustomFooter: false,
      presets: {
        treeData: { toggledItems: [{ itemId: 4, isCollapsed: true }] },
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
