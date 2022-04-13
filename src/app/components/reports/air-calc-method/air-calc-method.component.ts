import { Component, OnInit } from '@angular/core';
import {
  AngularGridInstance,
  Column,
  Editors,
  FieldType,
  Filters,
  Formatter,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { AirMeasureMethodService } from '@services/reports/air/air-measure-method.service';
import { AirMeasureMethodModel } from '@models/reports/air/air-measure-method.model';
import { TreeFormatter } from 'src/app/modules/formatters/tree-formatter';
@Component({
  selector: 'app-air-calc-method',
  templateUrl: './air-calc-method.component.html',
  styleUrls: ['./air-calc-method.component.scss'],
})
export class AirCalcMethodComponent implements OnInit {
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: AirMeasureMethodModel[] = [];
  private _commandQueue: any = [];
  gridObj: any;
  dataViewObj: any;
  isExcludingChildWhenFiltering = false;
  isAutoApproveParentItemWhenTreeColumnIsValid = true;
  reportId!: number;
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // this.dataViewObj.getItemMetadata = (row: any) => {
    //   const newCssClass = 'bg-info text-white';
    //   const item = this.dataViewObj.getItem(row);
    //   if (
    //     item.areaName === 'Материалы' ||
    //     item.areaName === 'Загрязняющее вещество'
    //   ) {
    //     return {
    //       cssClasses: newCssClass,
    //     };
    //   } else {
    //     return '';
    //   }
    // };
    this.gridObj.onBeforeEditCell.subscribe((e: any, args: any) => {
      if (args.item.__hasChildren) {
        return false;
      } else if (
        args.item.dicMaterialId &&
        args.column.id === 'actualVoumeTons'
      ) {
        return false;
      } else if (
        args.item.dicMaterialId &&
        args.column.id === 'actualVoumeGS'
      ) {
        return false;
      } else if (args.item.dicMaterialId && args.column.id === 'reason') {
        return false;
      } else if (args.item.dicPollutantId && args.column.id === 'consumption') {
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
      this.refreshList();
    });
  }

  ngOnInit(): void {
    this.defineGrid();
  }

  refreshList() {
    this.airMeasureMethodService
      .getAirMeasureMethodLists(this.reportId, 'calc')
      .subscribe((data: any[]) => {
        data.forEach((item: any) => {
          let list: any[];
          item.source.forEach((source: any) => {
            source.pollutants.forEach((pollutant: any) => {
              const b = { areaName: pollutant.dicPollutantName };
              Object.assign(pollutant, b);
            });
            source.materials.forEach((material: any) => {
              const b = { areaName: material.dicMaterialName };
              Object.assign(material, b);
            });
            list = [
              {
                id: new Date().getTime() + Math.random(),
                areaName: 'Загрязняющее вещество',
                source: [...source.pollutants],
              },
              {
                id: new Date().getTime() + Math.random(),
                areaName: 'Материалы',
                source: [...source.materials],
              },
            ];

            Object.assign(source, {
              areaName: source.sourceName,
              source: list,
            });
          });
        });

        this.dataset = data;
      });
  }
  // create a custom Formatter and returning a string and/or an object of type FormatterResultObject
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

  consumptionFormatter: Formatter = (
    row: number,
    cell: number,
    value: any,
    columnDef: Column,
    dataContext: any,
    grid?: any
  ) => {
    if (!dataContext.dicPollutantId && value === null) {
      return `<div class="d-flex justify-content-between"> <i>${0}</i> <i class="bi bi-pen"> </i>  </div>`;
    } else if (dataContext.dicMaterialId) {
      return `<div class="d-flex justify-content-between"> <i>${value}</i> <i class="bi bi-pen"> </i>  </div>`;
    } else if (dataContext.dicPollutantId) {
      return { addClasses: 'bg-secondary bg-opacity-50', text: '' };
    } else {
      return '';
    }
  };

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'areaName',
        name: 'Наименование Площадка',
        field: 'areaName',
        type: FieldType.string,
        width: 200,
        formatter: Formatters.multiple,
        params: {
          formatters: [TreeFormatter],
        },
        filterable: true,
        sortable: true,
      },
      {
        id: 'consumption',
        name: 'Расход сырья, (тонн)',
        field: 'consumption',
        filterable: true,
        sortable: true,
        formatter: this.consumptionFormatter,
        editor: { model: Editors.integer },
        type: FieldType.number,
        exportWithFormatter: true,
        filter: { model: Filters.compoundInputNumber },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const consumption = args.dataContext.consumption;
          const dicMaterialId = args.dataContext.dicMaterialId;
          const data = {
            id,
            consumption,
            dicMaterialId,
          };
          this.airMeasureMethodService
            .addAirMeasureMethodMaterial(data)
            .subscribe((res: any) => {});
        },
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
        formatter: this.reasonFormatter,
        columnGroup: 'Фактический результат',
        type: FieldType.number,
        editor: { model: Editors.integer, placeholder: 'тонн /год' },
        filterable: true,
        sortable: true,
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const actualVoumeTons = args.dataContext.actualVoumeTons;
          const standartLimitTons = args.dataContext.standartLimitTons;
          const aboveVoumeTons = standartLimitTons - actualVoumeTons;
          const data = {
            id: id,
            nameField: 'ActualVoumeTons',
            valueField: actualVoumeTons.toString(),
          };
          if (args.dataContext.actualVoumeTons) {
            this.airMeasureMethodService
              .addAirMeasureMethod(data)
              .subscribe((res: any) => {});
          }

          const data2 = {
            id: id,
            nameField: 'AboveVoumeTons',
            valueField: aboveVoumeTons.toString(),
          };

          this.airMeasureMethodService
            .addAirMeasureMethod(data2)
            .subscribe((res: any) => {
              const newData = {
                ...args.dataContext,
                aboveVoumeTons,
              };
              this.angularGrid.gridService.updateItemById(id, newData);
            });
        },
      },
      {
        id: 'actualVoumeGS',
        name: 'г/с',
        field: 'actualVoumeGS',
        formatter: this.reasonFormatter,
        columnGroup: 'Фактический результат',
        type: FieldType.number,
        editor: { model: Editors.integer, placeholder: 'г/с' },
        filterable: true,
        sortable: true,
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const actualVoumeGS = args.dataContext.actualVoumeGS;
          const data = {
            id: id,
            nameField: 'ActualVoumeGS',
            valueField: actualVoumeGS.toString(),
          };
          this.airMeasureMethodService
            .addAirMeasureMethod(data)
            .subscribe((res: any) => {
              // console.log(res);
            });
        },
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
        onCellChange: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          const reason = args.dataContext.reason;
          const data = {
            id: id,
            nameField: 'Reason',
            valueField: reason,
          };
          this.airMeasureMethodService
            .addAirMeasureMethod(data)
            .subscribe((res: any) => {
              // this.angularGrid.gridService.updateItemById(id, args.dataContext);
            });
        },
      },
    ];

    this.gridOptions = {
      enableFiltering: true,
      enableTreeData: true,
      multiColumnSort: false,
      treeDataOptions: {
        columnId: 'areaName',
        childrenPropName: 'source',
        excludeChildrenWhenFilteringTree: this.isExcludingChildWhenFiltering,
        autoApproveParentItemWhenTreeColumnIsValid:
          this.isAutoApproveParentItemWhenTreeColumnIsValid,
        initialSort: {
          columnId: 'areaName',
          direction: 'DESC',
        },
      },

      headerRowHeight: 55,
      rowHeight: 55,
      showCustomFooter: false,
      presets: {
        treeData: { toggledItems: [{ itemId: 1, isCollapsed: true }] },
      },
    };
  }
}
