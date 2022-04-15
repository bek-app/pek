import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportService } from '@services/reports/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportId!: number;
  report: any;
  reportRoute: any[] = [];
  activeLinkIndex = -1;
  sidenavWidth = 4;
  ngStyle!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {
    this.route.params.subscribe((param: Params) => {
      this.reportId = +param['id'];
    });
  }

  increase() {
    this.sidenavWidth = 32;
  }

  decrease() {
    this.sidenavWidth = 4;
  }

  ngOnInit(): void {
    this.reportService.getReport(this.reportId).subscribe((data) => {
      this.report = data;
    });

    this.router.events.subscribe(() => {
      this.activeLinkIndex = this.reportRoute.indexOf(
        this.reportRoute.find((report) => report.src === '.' + this.router.url)
      );
    });

    this.reportRoute = [
      {
        index: 0,
        src: 'accumulation-waste',
        name: 'Накоплению отходов',
      },
      {
        index: 1,
        src: 'operation-waste',
        name: ' Операция на отходов',
      },
      { index: 2, src: 'burial-waste', name: 'Захоронению отходов' },
      {
        index: 3,
        src: 'receiving-waste',
        name: 'Прием отходов',
      },
      {
        index: 4,
        src: 'tbo-gaz-monitoring',
        name: ' Газовый мониторинг полигонов',
      },
      {
        index: 5,
        src: 'labarotory-list',
        name: 'Производственный мониторинг',
      },
      { index: 6, src: 'air-area-list', name: 'Атмосферный воздух' },
      {
        index: 7,
        src: 'air-calc-method',
        name: 'Результаты на основе расчетов ',
      },
      {
        index: 8,
        src: 'radiation-list',
        name: 'Сведения по радиационному мониторингу',
      },
    ];
  }

  send() {
    if (confirm('Are you sure to  change ? ')) {
      this.reportService.changeStatusReport(this.reportId).subscribe(() => {
        this.router.navigate(['/report-list']);
      });
    }
  }
}
