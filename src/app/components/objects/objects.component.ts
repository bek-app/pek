import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ObjectModel } from '@models/objects/object.model';
import { TranslateService } from '@ngx-translate/core';
import { ObjectsService } from '@services/objects/objects.service';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss'],
})
export class ObjectsComponent implements OnInit {
  pekObjects: ObjectModel[] = [];
  objectId!: number;
  objectsRoute: any[] = [];
  activeLinkIndex = -1;
  isExpanded = false;
  constructor(
    private route: ActivatedRoute,
    protected translate: TranslateService,
    private objService: ObjectsService,
    private router: Router
  ) {
    const {
      SOURCE_EMISSION,
      GAS_MONITORING,
      WASTE_WATER,
      WASTE_PLACE,
      BURIAL_PLACE,
    } = this.translate.instant('OBJECTS_MENU');

    this.objectsRoute = [
      {
        src: './source-emissions',
        name: SOURCE_EMISSION,
        index: 0,
        icon: 'source',
      },
      {
        src: './gas-monitoring',
        name: GAS_MONITORING,
        index: 1,
        icon: 'monitoring',
      },
      {
        src: './waste-water',
        name: WASTE_WATER,
        index: 2,
        icon: 'water',
      },
      {
        src: './waste-place',
        name: WASTE_PLACE,
        index: 3,
        icon: 'place',
      },
      {
        src: './burial-place',
        name: BURIAL_PLACE,
        index: 4,
        icon: 'place',
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.activeLinkIndex = this.objectsRoute.indexOf(
        this.objectsRoute.find((obj) => obj.src === '.' + this.router.url)
      );
    });

    this.route.params.subscribe(
      (params: Params) => (this.objectId = +params['id'])
    );

    this.objService.getObject(this.objectId).subscribe({
      next: (data: any) => {
        this.pekObjects.push(data);
      },
    });
  }

  increase() {
    this.isExpanded = true;
  }

  decrease() {
    this.isExpanded = false;
  }
}
