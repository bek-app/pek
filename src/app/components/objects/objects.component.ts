import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ObjectModel } from '@models/objects/object.model';
import { TranslateService } from '@ngx-translate/core';
import { ObjectsService } from '@services/objects/objects.service';

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
  constructor(
    private route: ActivatedRoute,
    protected translate: TranslateService,
    private objService: ObjectsService,
    private router: Router
  ) {
    this.translate
      .get('OBJECTS_MENU')
      .subscribe(
        (data: {
          SOURCE_EMISSION: string;
          GAS_MONITORING: string;
          WASTE_WATER: string;
          WASTE_PLACE: string;
          BURIAL_PLACE: string;
        }) => {
          const {
            SOURCE_EMISSION,
            GAS_MONITORING,
            WASTE_WATER,
            WASTE_PLACE,
            BURIAL_PLACE,
          } = data;

          this.objectsRoute = [
            {
              src: './source-emissions',
              name: SOURCE_EMISSION,
              index: 0,
            },
            {
              src: './gas-monitoring',
              name: GAS_MONITORING,
              index: 1,
            },
            { src: './waste-water', name: WASTE_WATER, index: 2 },
            {
              src: './waste-place',
              name: WASTE_PLACE,
              index: 3,
            },
            {
              src: './burial-place',
              name: BURIAL_PLACE,
              index: 4,
            },
          ];
        }
      );
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
      next: () => {
        (data: ObjectModel) => {
          this.pekObjects.push(data);
        };
      },
    });

    this.translate.instant('OBJECTS_MENU');
  }
}
