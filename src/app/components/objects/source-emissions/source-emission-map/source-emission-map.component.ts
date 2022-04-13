import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SourceEmissionsService } from '@services/objects/source-emissions.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-source-emission-map',
  templateUrl: './source-emission-map.component.html',
  styleUrls: ['./source-emission-map.component.scss'],
})
export class SourceEmissionMapComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
