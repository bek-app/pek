import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/material/material.module';
import { CustomTranslateModule } from './shared/translate/translate.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { ObjectsComponent } from './components/objects/objects.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ObjectListComponent } from './components/object-list/object-list.component';
import { CommonComponent } from './layouts/common/common.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ObjectFormComponent } from './components/object-list/object-form/object-form.component';
import { SlickGridModule } from './shared/slickgrid/slickgrid.module';
import { SourceEmissionsComponent } from './components/objects/source-emissions/source-emissions.component';
import { GasMonitoringComponent } from './components/objects/gas-monitoring/gas-monitoring.component';
import { WasteWaterComponent } from './components/objects/waste-water/waste-water.component';
import { WastePlaceComponent } from './components/objects/waste-place/waste-place.component';
import { BurialPlaceComponent } from './components/objects/burial-place/burial-place.component';
import { CalculationMethodComponent } from './components/objects/source-emissions/calculation-method/calculation-method.component';
import { InstrumentalMeasurementComponent } from './components/objects/source-emissions/instrumental-measurement/instrumental-measurement.component';
import { InstrumentalMeasurementFormComponent } from './components/objects/source-emissions/instrumental-measurement/instrumental-measurement-form/instrumental-measurement-form.component';
import { PollutantsFormComponent } from './components/objects/source-emissions/pollutants-form/pollutants-form.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { CalculationMethodFormComponent } from './components/objects/source-emissions/calculation-method/calculation-method-form/calculation-method-form.component';
import { DicFormComponent } from './components/dic-form/dic-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ObjectsComponent,
    ReportsComponent,
    ReportListComponent,
    ObjectListComponent,
    CommonComponent,
    ObjectFormComponent,
    SourceEmissionsComponent,
    GasMonitoringComponent,
    WasteWaterComponent,
    WastePlaceComponent,
    BurialPlaceComponent,
    InstrumentalMeasurementComponent,
    CalculationMethodComponent,
    InstrumentalMeasurementFormComponent,
    PollutantsFormComponent,
    ConfirmationDialogComponent,
    CalculationMethodFormComponent,
    DicFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    FlexLayoutModule,
    CustomTranslateModule,
    SlickGridModule,
    MtxGridModule,
    MtxSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
