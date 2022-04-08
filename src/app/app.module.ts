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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
