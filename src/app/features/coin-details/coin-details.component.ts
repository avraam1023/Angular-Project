import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgIf } from '@angular/common';
import { ChartConfiguration, ChartType, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Import the required Chart.js components
import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Observable, map, switchMap, tap } from 'rxjs';

// Register the required Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
);

@Component({
  selector: 'app-coin-details',
  standalone: true,
  imports: [CurrencyPipe, BaseChartDirective, NgIf, AsyncPipe],
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.css'],
})
export class CoinDetailsComponent implements OnInit {
  constructor(
    private data: ApiService,
    private activateRoute: ActivatedRoute,
  ) {}

  // ასე ინიციალიზებული თვისებები (საწყისი მნიშვნელობის გარეშე)
  // არის დანაშაული
  coinData: any; // ნტ ნტ
  coinId!: string;
  days: number = 30;

  // RxJS ისწავლე და უფრო მარტივად, გასაგებად და ოპტიმიზირებულად დაწერ კოდს.
  // დააკვირდი, რომ დეკლარაციაშივე წერია ყველაფერი:
  //  - რაზეა დამოკიდებული მონაცემი
  //  - როგორ იცვლება მონაცემი
  //  - რა მოყვება ამ მონაცემის ცვლილებებს
  // ანუ ისე არაა გაფანტული მისი მნიშვნელობა, რომ მთელი კომპონენტის კოდის წაკითხვა დაგჭირდეს
  // (როგორც ეს შენ გიწერია)
  coinId$ = this.activateRoute.params.pipe(map((params) => params['id']));
  coinData$ = this.coinId$.pipe(
    switchMap((id) => this.data.getCurrencyById(id)),
  );
  lineChartData$: Observable<ChartConfiguration['data']> = this.coinId$.pipe(
    switchMap((coinId) =>
      this.data.getGrpahicalCurrencyData(coinId, this.days),
    ),
    map((res) => this.formatLineChartData(res)),
    // აქ delay ოპერატორის გამოყენებაც შეიძლება რომ ცოტა მოგვიანებით დარეფრეშდეს გრაფიკი
    tap(() => {
      // როცა სტრიმი დააემითებს, დაააფდეითე ჩართი
      this.myLineChart?.update();
    }),
  );

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Price Trends',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  ngOnInit(): void {
    this.activateRoute.params.subscribe((val) => {
      this.coinId = val['id'];
      // ფაქტობრივად subscribe-ის შიგნით გაქვს subscribe რაც ცუდი აზრია
      this.getCoinData();
      this.getGraphData(this.days);
    });
  }

  getCoinData() {
    this.data.getCurrencyById(this.coinId).subscribe((res) => {
      this.coinData = res;
      console.log(this.coinData);
    });
  }

  getGraphData(days: number) {
    this.days = days; // ისედაც this.days-დან იღებ ამ ინფორმაციას და ისევ მაგას რატომ უტოლებ?
    this.data
      .getGrpahicalCurrencyData(this.coinId, this.days)
      .subscribe((res) => {
        setTimeout(() => {
          // hack,  ალბათ ინციალიზებული არაა ჩარტი ამ დროს. თემფლეითის რეფერენსს რომ ჩასწვდე ngAfterViewInit-ის ჰუკი გინდა.
          this.myLineChart.chart?.update();
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => a[1]);
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}:${date.getMinutes()} PM`
              : `${date.getHours()}:${date.getMinutes()} AM`;
          return days === 1 ? time : date.toLocaleDateString();
        });
      });
  }

  formatLineChartData(res: any): ChartConfiguration['data'] {
    // შენი არატიპიზირებული კოდის გამო მეც ANY-ს წერა მიწევს!
    const datasetData = res.prices.map((a: any) => a[1]);
    const lineChartLabels = res.prices.map((a: any) => {
      const date = new Date(a[0]);
      const time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
          : `${date.getHours()}:${date.getMinutes()} AM`;
      return this.days === 1 ? time : date.toLocaleDateString();
    });

    return {
      datasets: [
        {
          data: datasetData,
          label: 'Price Trends',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: '#009688',
          pointBackgroundColor: '#009688',
          pointBorderColor: '#009688',
          pointHoverBackgroundColor: '#009688',
          pointHoverBorderColor: '#009688',
        },
      ],
      labels: lineChartLabels,
    };
  }
}
