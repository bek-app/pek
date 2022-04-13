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
import { GasMonitoringFormComponent } from './components/objects/gas-monitoring/gas-monitoring-form/gas-monitoring-form.component';
import { GasMonitoringPointsComponent } from './components/objects/gas-monitoring/gas-monitoring-points/gas-monitoring-points.component';
import { PointsFormComponent } from './components/objects/gas-monitoring/gas-monitoring-points/points-form/points-form.component';
import { WasteWaterFormComponent } from './components/objects/waste-water/waste-water-form/waste-water-form.component';
import { WastePlaceFormComponent } from './components/objects/waste-place/waste-place-form/waste-place-form.component';
import { BurialPlaceFormComponent } from './components/objects/burial-place/burial-place-form/burial-place-form.component';
import { ReportFormComponent } from './components/report-list/report-form/report-form.component';
import { AccumulationWasteComponent } from './components/reports/accumulation-waste/accumulation-waste.component';
import { OperationWasteComponent } from './components/reports/operation-waste/operation-waste.component';
import { BurialWasteComponent } from './components/reports/burial-waste/burial-waste.component';
import { ReceivingWasteComponent } from './components/reports/receiving-waste/receiving-waste.component';
import { AccumulationWasteSenderComponent } from './components/reports/accumulation-waste/accumulation-waste-sender/accumulation-waste-sender.component';
import { AccumulationWasteSenderFormComponent } from './components/reports/accumulation-waste/accumulation-waste-sender/accumulation-waste-sender-form/accumulation-waste-sender-form.component';
import { AccumulationWasteFormComponent } from './components/reports/accumulation-waste/accumulation-waste-form/accumulation-waste-form.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { OperationWasteFormComponent } from './components/reports/operation-waste/operation-waste-form/operation-waste-form.component';
import { OperationWasteSenderComponent } from './components/reports/operation-waste/operation-waste-sender/operation-waste-sender.component';
import { OperationWasteSenderFormComponent } from './components/reports/operation-waste/operation-waste-sender/operation-waste-sender-form/operation-waste-sender-form.component';
import { BurialWasteFormComponent } from './components/reports/burial-waste/burial-waste-form/burial-waste-form.component';
import { ReceivingWasteFormComponent } from './components/reports/receiving-waste/receiving-waste-form/receiving-waste-form.component';
import { ReceivedWasteFormComponent } from './components/reports/receiving-waste/received-waste-list/received-waste-form/received-waste-form.component';
import { ReceivedWasteListComponent } from './components/reports/receiving-waste/received-waste-list/received-waste-list.component';
import WasteOperationListComponent from './components/reports/receiving-waste/waste-operation-list/waste-operation-list.component';
import { WasteOperationFormComponent } from './components/reports/receiving-waste/waste-operation-list/waste-operation-form/waste-operation-form.component';
import { WasteAfterOperationComponent } from './components/reports/receiving-waste/waste-after-operation/waste-after-operation.component';
import { WasteAfterOperationFormComponent } from './components/reports/receiving-waste/waste-after-operation/waste-after-operation-form/waste-after-operation-form.component';
import { WasteSenderComponent } from './components/reports/receiving-waste/waste-sender/waste-sender.component';
import { WasteSenderFormComponent } from './components/reports/receiving-waste/waste-sender/waste-sender-form/waste-sender-form.component';
import { WasteRemainingComponent } from './components/reports/receiving-waste/waste-remaining/waste-remaining.component';
import { WasteRemainingFormComponent } from './components/reports/receiving-waste/waste-remaining/waste-remaining-form/waste-remaining-form.component';
import { LabarotoryListComponent } from './components/reports/labarotory-list/labarotory-list.component';
import { LabarotoryFormComponent } from './components/reports/labarotory-list/labarotory-form/labarotory-form.component';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
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
    GasMonitoringFormComponent,
    GasMonitoringPointsComponent,
    PointsFormComponent,
    WasteWaterFormComponent,
    WastePlaceFormComponent,
    BurialPlaceFormComponent,
    ReportFormComponent,
    AccumulationWasteComponent,
    OperationWasteComponent,
    BurialWasteComponent,
    ReceivingWasteComponent,
    AccumulationWasteFormComponent,
    AccumulationWasteSenderComponent,
    AccumulationWasteSenderFormComponent,
    OperationWasteFormComponent,
    OperationWasteSenderComponent,
    OperationWasteSenderFormComponent,
    BurialWasteFormComponent,
    ReceivingWasteFormComponent,
    ReceivedWasteFormComponent,
    ReceivedWasteListComponent,
    WasteOperationListComponent,
    WasteOperationFormComponent,
    WasteAfterOperationComponent,
    WasteAfterOperationFormComponent,
    WasteSenderComponent,
    WasteSenderFormComponent,
    WasteRemainingComponent,
    WasteRemainingFormComponent,
    LabarotoryListComponent,
    LabarotoryFormComponent,
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
    NgxMaskModule.forRoot(maskConfigFunction),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
