import { PointLike } from './../../../node_modules/zrender/lib/core/Point.d';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, WritableSignal } from '@angular/core';
import * as echarts from 'echarts';
import { ApiService } from '../service/api-service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CatsDataGridComponent } from 'cats-data-grid';
interface DeviceCounts {
  Windows: number;
  Mac: number;
  Linux: number;
}
@Component({
  selector: 'app-echart',
  imports: [CatsDataGridComponent],
  templateUrl: './echart.html',
  styleUrl: './echart.scss',
})
export class Echart implements OnInit, AfterViewInit {
  chart!: echarts.ECharts;
  rowData: any[] = [];
  colDefs = this.generateColDefs();
  @ViewChild('modalUserTable') modalUserTable: any
  @ViewChild('chart') chartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('timeChart') timeChart!: ElementRef<HTMLDivElement>;
  @ViewChild('barChart') barChart!: ElementRef<HTMLDivElement>;
  barChartInstance!: echarts.ECharts;
  timeChartInstance!: echarts.ECharts;

  counts: DeviceCounts = {
    Windows: 0,
    Mac: 0,
    Linux: 0,
  };
  ngAfterViewInit(): void {
    this.chartdata();

    this.timechartdata();
    this.appurlBarChart()
  }
  constructor(private apiService: ApiService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.initChart();
    this.getEchartdata();
    this.updateChart({
      Windows: 120,
      Mac: 80,
      Linux: 40,
    });
  }

  initChart() {
    const chartDom = document.getElementById('deviceChart')!;
    this.chart = echarts.init(chartDom);
    this.chart.on('click', (params: any) => {
      this.getusers(params.name, params.componentType);
    });
  }

  getEchartdata() {
    this.apiService.getUserChartdata().subscribe({
      next: (res: any) => {
        const counts: any = { Windows: 0, Mac: 0, Linux: 0 };
        res.forEach((user: any) => {
          if (user.os && counts[user.os] !== undefined) {
            counts[user.os]++;
          }
        });

        this.updateChart(counts);
      },
      error: (err) => console.error(err),
    });
  }

  updateChart(counts: DeviceCounts) {
    this.counts = counts;

    const total = counts.Windows + counts.Mac + counts.Linux;

    this.chart.setOption({
      title: {
        text: 'Device Distribution',
        left: 'center',
        top: 0,
      },

      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: false,
      },

      series: [
        {
          name: 'Devices',
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '75%'],
          startAngle: 180,
          endAngle: 360,
          padAngle: 5,
          itemStyle: {
            borderRadius: 4,
          },
          data: [
            { value: counts.Windows, name: 'Windows' },
            { value: counts.Mac, name: 'Mac' },
            { value: counts.Linux, name: 'Linux' },
          ],
        },
      ],

      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '58%',
          style: {
            text: total.toString(),
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#000',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '70%',
          style: {
            text: 'Total Device',
            fontSize: 12,
            fill: '#666',
          },
        },
      ],
    });
  }
  onLegendClick(name: 'Windows' | 'Mac' | 'Linux') {
    this.chart.dispatchAction({
      type: 'legendToggleSelect',
      name: name,
    });
  }


  getusers(devices: any, componentType: any) {
    if (!devices || componentType !== 'series') return;
    this.apiService.getUserChartdata().subscribe({
      next: (res: any) => {
        this.rowData = res.filter((user: any) => user.os === devices)
        this.addUserModal(this.modalUserTable);
      },
      error: (err) => console.error(err),
    });
  }

  addUserModal(modal: any) {
    this.modalService.show(modal, {
      class: 'largeModel modal-dialog-centered',
      backdrop: true,

    });
  }

  generateColDefs() {
    return [
      { fieldName: 'id', headerName: 'ID' },
      { fieldName: 'name', headerName: 'Full Name' },
      { fieldName: 'email', headerName: 'Email' },
      { fieldName: 'designation', headerName: 'Designation' },
      { fieldName: 'source', headerName: 'Source' },
      { fieldName: 'userRole', headerName: 'User Role' },
      { fieldName: 'device', headerName: 'Device' },
      { fieldName: 'os', headerName: 'OS' }
    ];
  }

  chartdata() {
    const data = [
      ['09 am', 20],
      ['10 am', 32],
      ['11 am', 28],
      ['12 pm', 65],
      ['01 pm', 10],
      ['03 pm', 20],
      ['06 pm', 56],
      ['07 pm', 47],
      ['08 pm', 41],
      ['09 pm', 90]
    ];
    const xData = data.map(d => d[0]);
    const yData = data.map(d => d[1]);
    this.chartInstance = echarts.init(this.chartEl.nativeElement);
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        confine: true, // ✅ tooltip chart ke andar rahe
        backgroundColor: 'transparent',
        borderWidth: 0,
        axisPointer: {
          type: 'line',
          z: 1, // ✅ line peeche chali jaayegi
          lineStyle: {
            color: '#2e7d32',
            width: 1,
            type: 'dashed'
          }
        },
        formatter: (params: any) => {
          const item = params[0];
          return `
      <div style="
        background:#fff;
        border-radius:8px;
        padding:10px 14px;
        min-width:120px;
        box-shadow:0 4px 12px rgba(0,0,0,0.12);
        border:1px solid #e0e0e0;
        position:relative;
        z-index:10;
      ">
        <div style="
          font-weight:600;
          font-size:13px;
          color:#222;
          padding-bottom:6px;
          border-bottom:1px solid #eee;
        ">
          ${item.axisValue}
        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-top:8px;
          font-size:12px;
          color:#2e7d32;
          font-weight:600;
        ">
          <span style="
            width:10px;
            height:10px;
            background:#2e7d32;
            border-radius:2px;
            display:inline-block;
          "></span>
          <span style="font-family: Open Sans;
font-weight: 400;
font-style: Regular;
font-size: 12px;
color: #434A51;
leading-trim: NONE;
line-height: 18px;
letter-spacing: 0%;
text-align: center;
">Activity</span>: ${item.data}%
        </div>
      </div>
    `;
        }
      },

      grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'line',
          data: yData,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            color: '#2e7d32',
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(46,125,50,0.4)' },
              { offset: 1, color: 'rgba(46,125,50,0.05)' }
            ])
          }
        }
      ]
    };
    this.chartInstance.setOption(option);
  }

  timechartdata() {
    this.timeChartInstance = echarts.init(this.timeChart.nativeElement);

    const systemTimeData = [
      { value: 8.33, name: 'Time On System', time: '05h:20m:04s', color: '#388E3C' },
      { value: 1.33, name: 'Time Away From System', time: '02h:20m:04s', color: '#C0C2C5' },
      { value: 0.53, name: 'Offline Time', time: '00h:20m:04s', color: '#434A51' }
    ];
    const productivityData = [
      { value: 5, name: 'High Productivity', time: '03h:10m:00s', color: '#1976D2' },
      { value: 3, name: 'Medium Productivity', time: '02h:00m:00s', color: '#FFC107' },
      { value: 2, name: 'Low Productivity', time: '01h:20m:00s', color: '#F44336' }
    ];
    const workModesData = [
      { value: 6, name: 'Remote', time: '04h:00m:00s', color: '#9C27B0' },
      { value: 3, name: 'Office', time: '02h:00m:00s', color: '#00BCD4' },
      { value: 1, name: 'Hybrid', time: '00h:40m:00s', color: '#FF9800' }
    ];

    const setChartData = (data: any[], centerText: string) => {
      const option: echarts.EChartsOption = {
        tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>${p.data.time}` },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          formatter: (name: string) => {
            const item = data.find(d => d.name === name);
            return `{n|${name}}  {t|${item?.time}}`;
          },
          textStyle: { rich: { n: { fontSize: 13, color: '#333' }, t: { fontSize: 13, color: '#666', padding: [0, 0, 0, 8] } } }
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '85%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            padAngle: 3,
            itemStyle: { borderWidth: 2, borderRadius: 10, borderColor: '#fff' },
            label: { show: false },
            labelLine: { show: false },
            data: data.map(d => ({ value: d.value, name: d.name, time: d.time, itemStyle: { color: d.color } }))
          }
        ],
        graphic: [
          { type: 'text', left: '25%', top: '44%', style: { text: centerText, fill: '#000', fontSize: 18, fontWeight: 'bold', align: 'center' } },
          { type: 'text', left: '25%', top: '50%', style: { text: 'Total Logged Hours', fill: '#666', fontSize: 12, align: 'center' } }
        ]
      };
      this.timeChartInstance.setOption(option);
    };

    setChartData(systemTimeData, '08h:32m:06s');

    let menu = document.getElementById('chartMenu')!;

    this.timeChartInstance.getZr().on('contextmenu', (params: any) => {
      const point = [params.offsetX, params.offsetY];
      const seriesHit = this.timeChartInstance.containPixel('series', point);
      if (!seriesHit) return; // only show menu on slices

      params.event.preventDefault();

      // Show menu at cursor
      menu.style.display = 'block';
      menu.style.top = params.offsetY + 'px';
      menu.style.left = params.offsetX + 'px';

      // Remove menu on click outside
      const hideMenu = (e: MouseEvent) => {
        if (!(menu as any).contains(e.target)) menu.style.display = 'none';
        document.removeEventListener('click', hideMenu);
      };
      document.addEventListener('click', hideMenu);
    });

    // Handle menu clicks
    menu.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', (e: any) => {
        const mode = item.getAttribute('data-mode');
        switch (mode) {
          case 'system': setChartData(systemTimeData, '08h:32m:06s'); break;
          case 'productivity': setChartData(productivityData, '06h:30m:00s'); break;
          case 'workmodes': setChartData(workModesData, '07h:40m:00s'); break;
        }
        menu.style.display = 'none';
      });
    });
  }



  appurlBarChart() {
    this.barChartInstance = echarts.init(this.barChart.nativeElement);
    const tooltipMeta: any = {
      Figma: {
        web: '01h:42m:04s',
        exe: '00h:38m:24s'
      },
      Instagram: {
        web: '01h:10m:00s',
        exe: '—'
      },
      Teams: {
        web: '—',
        exe: '01h:12m:00s'
      },
      Chrome: {
        web: '00h:48m:00s',
        exe: '—'
      },
      'youtube.com': {
        web: '00h:42m:00s',
        exe: '—'
      }
    };

    const option: echarts.EChartsOption = {
      backgroundColor: '#F9FAFB',

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const name = params[0].axisValue;
          const meta = tooltipMeta[name];
          let html = `<strong>${name}</strong><br/>`;
          params.forEach((p: any) => {
            if (p.value > 0) {
              html += `
          <span style="display:inline-block;width:10px;height:10px;
          background:${p.color};border-radius:50%;margin-right:6px"></span>
          ${p.seriesName}: ${p.value} hr<br/>
        `;
            }
          });

          if (meta) {
            html += `
        <hr style="margin:4px 0"/>
        🌐 ${name} ${meta.web}<br/>
        💻 ${name} ${meta.exe}
      `;
          }
          return html;
        }
      },
      legend: {
        top: 10,
        left: 'center',
        itemWidth: 16,
        itemHeight: 10,
        textStyle: {
          color: '#374151',
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        top: '18%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [
          'Figma', 'Instagram', 'Teams', 'Chrome',
          'youtube.com', 'Docs', 'hotstar.com',
          'Facebook', 'Powerpoint', 'adobe.com'
        ],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#6B7280',
          fontSize: 12,
          rotate: 20
        }
      },
      yAxis: {
        type: 'value',
        max: 5,
        axisLabel: {
          formatter: '{value} hr',
          color: '#9CA3AF'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E5E7EB'
          }
        }
      },
      series: [
        {
          name: 'Productive App',
          type: 'bar',
          data: [2.5, 0, 1.2, 0.8, 0.7, 0.6, 0, 0, 0.4, 0.3],
          barWidth: 18,
          barGap: '35%',
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#6D8CFF' },
              { offset: 1, color: '#4F7CF3' }
            ])
          }
        },
        {
          name: 'Non Productive App',
          type: 'bar',
          data: [0, 1.6, 0, 0, 0, 0, 0.5, 0.4, 0, 0],
          barWidth: 18,
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FF7A7A' },
              { offset: 1, color: '#EF4444' }
            ])
          }
        },
        {
          name: 'Neutral App',
          type: 'bar',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          barWidth: 18,
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FFD166' },
              { offset: 1, color: '#F59E0B' }
            ])
          }
        }
      ],

      animationDuration: 1200,
      animationEasing: 'cubicOut'
    };


    this.barChartInstance.setOption(option);
  }

  chartInstance: echarts.ECharts | null = null;

  onChartInit(ec: any) {
    this.chartInstance = ec;
  }

  downloadChart() {
    if (this.chartInstance) {
      const dataURL = this.chartInstance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
      const link = document.createElement('a');
      link.download = 'chart-screenshot.png';
      link.href = dataURL;
      link.click();
    }
  }
}


