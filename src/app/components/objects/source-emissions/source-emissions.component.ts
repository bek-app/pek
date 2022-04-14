import {
  Component,
  ComponentRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Column,
  GridOption,
  AngularGridInstance,
  Formatters,
  OnEventArgs,
  Formatter,
} from 'angular-slickgrid';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InstrumentalMeasurementComponent } from './instrumental-measurement/instrumental-measurement.component';
import { InstrumentalMeasurementFormComponent } from './instrumental-measurement/instrumental-measurement-form/instrumental-measurement-form.component';
import { SourceEmissionMapComponent } from './source-emission-map/source-emission-map.component';
import { SharedService } from '@services/shared.service';
@Component({
  selector: 'app-source-emissions',
  templateUrl: './source-emissions.component.html',
  styleUrls: ['./source-emissions.component.scss'],
})
export class SourceEmissionsComponent implements OnInit {
  [x: string]: any;
  angularGrid!: AngularGridInstance;
  columnDefinitions!: Column[];
  gridOptions!: GridOption;
  dataset: any[] = [];
  gridObj: any;
  dataViewObj: any;

  isActive = false;
  form: FormGroup;
  submitted = false;
  objectId!: number;
  areaId!: number;
  tabLinks: any[] = [];
  activeLinkIndex = -1;
  viewMode = false;
  @ViewChild('areaForm') areaForm!: TemplateRef<any>;
  formDialogRef!: any;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    console.log(this.angularGrid);
  }

  constructor(
    private sourceEmissionsService: SourceEmissionsService,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {
    this.form = this.fb.group({
      areaName: new FormControl('', [Validators.required]),
    });

    this.sharedService.currentSource.subscribe(() => {
      setTimeout(() => {
        this.angularGrid.resizerService.resizeGrid();
      }, 100);
    });
  }

  openAreaDialog() {
    this.formDialogRef = this.dialog.open(this.areaForm, { width: '500px' });
    this.form.enable();
    this.viewMode = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.tabLinks.indexOf(
        this.tabLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });

    this.route.params.subscribe((param: Params) => {
      this.objectId = +param['id'];
      this.refreshList(this.objectId);
    });

    this.defineGrid();
  }

  onSelectedRowsChanged(e: any, args: any) {
    if (Array.isArray(args.rows)) {
      args.rows.forEach((idx: any) => {
        const item = this.gridObj.getDataItem(idx);
        this.sourceEmissionsService.sourceEmissionRefresh.next(item);
      });
    }
  }

  onCellClicked(e: any, args: any) {
    const item = this.gridObj.getDataItem(args.row);
    this.areaId = item.id;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = { pekObjectId: this.objectId, ...this.form.value };

    if (!this.isActive) {
      this.sourceEmissionsService.addAreaEmission(data).subscribe(() => {
        this.refreshList(this.objectId);
      });
    } else {
      this.sourceEmissionsService
        .updateAreaEmission({ id: this.areaId, ...data })
        .subscribe(() => {
          this.refreshList(this.objectId);
        });
    }
    this.dialog.closeAll();
  }

  editForm(id: number) {
    this.isActive = true;
    this.sourceEmissionsService.getAreaEmission(id).subscribe((value) => {
      this.form.patchValue(value);
    });
  }

  refreshList(objectId: number) {
    this.sourceEmissionsService
      .getAreaEmissionList(objectId)
      .subscribe((data) => (this.dataset = data));
  }

  openMap(id: number) {
    this.dialog.open(SourceEmissionMapComponent, {
      data: { id },
    });
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'areaName',
        name: 'Наименование площадки',
        field: 'areaName',
        filterable: true,
        sortable: true,
      },
      {
        id: 'countSource',
        name: 'Количество источников',
        field: 'countSource',
        filterable: true,
        sortable: true,
      },
      {
        id: 'map',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: () => `<i class="fa fa-map pointer"></i>`,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          this.openMap(id);
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
          this.openAreaDialog();
          this.editForm(id);
          this.form.disable();
          this.viewMode = true;
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
          this.openAreaDialog();
          const id = args.dataContext.id;
          this.editForm(id);
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
            this.sourceEmissionsService.deleteAreaEmission(id).subscribe(() => {
              this.refreshList(this.objectId);
            });
          }
        },
      },
    ];

    this.gridOptions = {
      gridHeight: 200,

      leaveSpaceForNewRows: true,
      rowHeight: 35,
      forceFitColumns: false,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
      },
    };
  }
}
