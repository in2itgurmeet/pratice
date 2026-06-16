import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  BarChart,
  CustomChartComponent,
  DoughnutChart,
  LinesChart,
  PieChart,
  SankeyChart
} from 'cats-charts'; 
import { CatsDataGridComponent } from 'cats-data-grid';
@Component({
  selector: 'app-multiline-chart',
  imports: [LinesChart, CommonModule,CatsDataGridComponent],
  templateUrl: './multiline-chart.html',
  styleUrl: './multiline-chart.scss',
})
export class MultilineChart {
showPopup = false;
colDefs = [

  {
    fieldName: 'deviceName',
    headerName: 'Device Name'
  },

  {
    fieldName: 'status',
    headerName: 'Status'
  },

  {
    fieldName: 'count',
    headerName: 'Count'
  },

  {
    fieldName: 'severity',
    headerName: 'Severity'
  }

];
selectedDate = '';

tableData: any[] = [];

  originalChartData = {
    series: [
      {
        name: 'No Drift',
        data: [0, 1, 0, 2, 1, 0, 3]
      },
      {
        name: 'Drift Detected',
        data: [4, 3, 4, 2, 5, 2, 1]
      }
    ],

    xAxisData: [
      '2026-06-20',
      '2026-06-21',
      '2026-06-22',
      '2026-06-23',
      '2026-06-24',
      '2026-06-25',
      '2026-06-26'
    ]
  };


lineChartConfig: any = {

  title: 'Drift Analysis',

  showTitle: true,

  xAxisData: this.originalChartData.xAxisData,

  colors: ['#00C853', '#FF5252'],

  showTooltip: true,

  showXAxisLine: true,

  showYAxisLine: true,

  legendPosition: 'top',

  legendAlign: 'right',

  legendDirection: 'horizontal',

  events: ['click'],

  series: this.originalChartData.series

};


  filterChartData(startDate: string, endDate: string) {

    const filteredIndexes =

      this.originalChartData.xAxisData
        .map((date: string, index: number) => ({
          date,
          index
        }))
        .filter((item: any) => {

          return (
            new Date(item.date) >= new Date(startDate)
            &&
            new Date(item.date) <= new Date(endDate)
          );

        });


    this.lineChartConfig = {

      ...this.lineChartConfig,

      xAxisData:
        filteredIndexes.map(x => x.date),

      series: [

        {
          name: 'No Drift',

          data:
            filteredIndexes.map(
              x =>
                this.originalChartData
                  .series[0]
                  .data[x.index]
            )
        },

        {
          name: 'Drift Detected',

          data:
            filteredIndexes.map(
              x =>
                this.originalChartData
                  .series[1]
                  .data[x.index]
            )
        }

      ]

    };

  }
onChartEvent(event: any) {

  console.log(event);

  const index =
    event?.data?.dataIndex;

  if (index === undefined) return;

  const date =
    this.lineChartConfig.xAxisData[index];

  const noDrift =
    this.lineChartConfig.series[0].data[index];

  const driftDetected =
    this.lineChartConfig.series[1].data[index];

  this.selectedDate = date;

  this.tableData = [
    {
      status: 'No Drift',
      value: noDrift
    },
    {
      status: 'Drift Detected',
      value: driftDetected
    }
  ];

  this.showPopup = true;

}


closePopup() {

  this.showPopup = false;

}
}