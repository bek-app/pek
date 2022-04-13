import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ObjectListComponent } from './components/object-list/object-list.component';
import { BurialPlaceComponent } from './components/objects/burial-place/burial-place.component';
import { GasMonitoringComponent } from './components/objects/gas-monitoring/gas-monitoring.component';
import { ObjectsComponent } from './components/objects/objects.component';
import { CalculationMethodComponent } from './components/objects/source-emissions/calculation-method/calculation-method.component';
import { InstrumentalMeasurementComponent } from './components/objects/source-emissions/instrumental-measurement/instrumental-measurement.component';
import { SourceEmissionsComponent } from './components/objects/source-emissions/source-emissions.component';
import { WastePlaceComponent } from './components/objects/waste-place/waste-place.component';
import { WasteWaterComponent } from './components/objects/waste-water/waste-water.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import { AccumulationWasteComponent } from './components/reports/accumulation-waste/accumulation-waste.component';
import { BurialWasteComponent } from './components/reports/burial-waste/burial-waste.component';
import { LabarotoryListComponent } from './components/reports/labarotory-list/labarotory-list.component';
import { OperationWasteComponent } from './components/reports/operation-waste/operation-waste.component';
import { ReceivingWasteComponent } from './components/reports/receiving-waste/receiving-waste.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CommonComponent } from './layouts/common/common.component';

const routes: Routes = [
  { path: '', redirectTo: 'common/home', pathMatch: 'full' },
  {
    path: 'common',
    component: CommonComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'object-list', component: ObjectListComponent },
      {
        path: 'objects/:id',
        component: ObjectsComponent,
        children: [
          {
            path: '',
            redirectTo: 'source-emissions',
            pathMatch: 'full',
          },
          {
            path: 'source-emissions',
            component: SourceEmissionsComponent,
            children: [
              {
                path: '',
                redirectTo: 'instrumental-measurement',
                pathMatch: 'full',
              },
              {
                path: 'instrumental-measurement',
                component: InstrumentalMeasurementComponent,
              },
              {
                path: 'calculation-method',
                component: CalculationMethodComponent,
              },
            ],
          },
          { path: 'gas-monitoring', component: GasMonitoringComponent },
          {
            path: 'waste-water',
            component: WasteWaterComponent,
          },
          {
            path: 'waste-place',
            component: WastePlaceComponent,
          },
          {
            path: 'burial-place',
            component: BurialPlaceComponent,
          },
        ],
      },
      { path: 'report-list', component: ReportListComponent },
      {
        path: 'reports/:id',
        component: ReportsComponent,
        children: [
          { path: '', redirectTo: 'accumulation-waste', pathMatch: 'full' },

          { path: 'accumulation-waste', component: AccumulationWasteComponent },
          { path: 'burial-waste', component: BurialWasteComponent },
          { path: 'operation-waste', component: OperationWasteComponent },
          { path: 'receiving-waste', component: ReceivingWasteComponent },
          {
            path: 'labarotory-list',
            component: LabarotoryListComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
