import { Component, OnInit } from '@angular/core';
import { CatsDataGridComponent } from 'cats-data-grid';
import { Apiservice } from '../../service/apiservice';

@Component({
  selector: 'app-table-view',
  imports: [CatsDataGridComponent],
  templateUrl: './table-view.html',
  styleUrl: './table-view.scss',
})
export class TableView implements OnInit {
  rowData: any[] = [];
  totalRecords: number = 0;

  constructor(private apiservice: Apiservice) { }

  ngOnInit() {
    this.getAllScduler();
  }
  onChekBoxSelection(event: any) {
    console.log(event);
  }

  colDefs = [
    {
      headerName: 'Schedule Name',
      fieldName: 'scheduleName',
    },
    {
      headerName: 'Operation',
      fieldName: 'operation.name',
    },
    {
      headerName: 'Schedule By',
      fieldName: 'scheduleBy.name',
      // valueGetter: (params: any) => params.data.scheduleBy?.name,
    },
    {
      headerName: 'Target',
      fieldName: 'target.name',
      // valueGetter: (params: any) => params.data.target?.name,
    },
    {
      headerName: 'Device Groups',
      fieldName: 'deviceGroup.name',
      
    },
    {
      headerName: 'Capture Start Date',
      fieldName: 'captureStartDate',
    },
    {
      headerName: 'Start Time',
      fieldName: 'startTime',
    },
    {
      headerName: 'Start Time Zone',
      fieldName: 'startTimeZone.name',
      // valueGetter: (params: any) => params.data.startTimeZone?.name,
    },
    {
      headerName: 'Capture End Type',
      fieldName: 'captureEndDateType.name',
      // valueGetter: (params: any) => params.data.captureEndDateType?.name,
    },
    {
      headerName: 'Capture End Date',
      fieldName: 'captureEndDate',
    },
    {
      headerName: 'End Time',
      fieldName: 'endTime',
    },
    {
      headerName: 'End Time Zone',
      fieldName: 'endTimeZone.name',
      // valueGetter: (params: any) => params.data.endTimeZone?.name,
    },
    {
      headerName: 'Frequency Mode',
      fieldName: 'frequencyMode.name',
      // valueGetter: (params: any) => params.data.frequencyMode?.name,
    },
    {
      headerName: 'Frequency',
      fieldName: 'frequency',
    },
    {
      headerName: 'Frequency Type',
      fieldName: 'frequencyType.name',
      // valueGetter: (params: any) => params.data.frequencyType?.name,
    },
    {
      headerName: 'Notify Completion',
      fieldName: 'notifyCompletion.name',
      // valueGetter: (params: any) => params.data.notifyCompletion?.name,
     
    },
    {
      headerName: 'Email Addresses',
      fieldName: 'emailAddresses.name',
    },
    {
      headerName: 'Compliance Policy Type',
      fieldName: 'compliancePolicyType.name'
    },
    {
      headerName: 'Compliance Policy Feature',
      fieldName: 'compliancePolicyFeature.name',
    },
    {
      headerName: 'Compliance Notify Changes',
      fieldName: 'complianceNotifyChanges.name',
    },
    {
      headerName: 'Created At',
      fieldName: 'createdAt',
    },
  ];
  getAllScduler() {
    this.apiservice.getAllSchduler().subscribe({
      next: (res) => {
        this.rowData = res
        this.totalRecords = res.length
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
