import { BsModalService } from 'ngx-bootstrap/modal';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api-service';
import { CatsDataGridComponent } from 'cats-data-grid';
import { Actionrender } from '../render/actionrender/actionrender';
import { InputCellRenderer } from '../render/input-cell-renderer/input-cell-renderer';
import { SingleSlect } from '../render/single-slect/single-slect';
import { CommonWizard } from '../commmon/common-wizard/common-wizard';
import { Educationdetails } from '../wizard/aducationdetails/aducationdetails';
import { UserDetails } from '../wizard/user-details/user-details';
import { Addresss } from '../wizard/addresss/addresss';
import { WizardInterface } from '../commmon/wizard-interface';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CatsDataGridComponent, CommonWizard],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit, AfterViewInit {
  @ViewChild('showData') showData: any;
  @ViewChild('noData') noData: any;
  wizardId = 'user-details';
  wizardSteps: WizardInterface[] = [
    { title: 'UserDetails', component: UserDetails },
    { title: 'Address', component: Addresss },
    { title: 'EducationDetails', component: Educationdetails },
  ];
  pageSize = 10;
  tableOption: any = {
    parentRef: this
  };
  rowData: any[] = [];
  updateRowDataObject: any = {};
  flagValueChanged = false;

  optionList = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'InActive' },
  ];

  colDefs = this.generateColDefs();

  constructor(private apiService: ApiService, private modalService: BsModalService) { }
  ngAfterViewInit(): void {
    this.tableOption.noDataTemplate = this.noData;
  }

  ngOnInit(): void {
    this.tableOption = {
      parentRef: this,
    };

    this.apiService.getUserdata().subscribe((res: any[]) => {
      this.rowData = res.map((row) => ({
        ...row,
        isInEdit: false,
      }));
    });
  }

  // ---------------- COLUMNS ----------------
  generateColDefs() {
    return [
      { fieldName: 'id', headerName: 'ID' },
      {
        fieldName: 'name',
        headerName: 'Name',
        cellRenderer: InputCellRenderer,
        cellRendererParams: {
          onValueChange: (val: any) => this.onUpdateRowData(val, 'name'),
        },
      },
      {
        fieldName: 'username',
        headerName: 'Username',
        cellRenderer: InputCellRenderer,
        filterable: false,
        cellRendererParams: {
          onValueChange: (val: any) => this.onUpdateRowData(val, 'username'),
        },
      },
      {
        fieldName: 'email',
        headerName: 'Email',
        cellRenderer: InputCellRenderer,
        cellRendererParams: {
          onValueChange: (val: any) => this.onUpdateRowData(val, 'email'),
        },
      },
      {
        fieldName: 'phone',
        headerName: 'Phone',
        cellRenderer: InputCellRenderer,
        cellRendererParams: {
          onValueChange: (val: any) => this.onUpdateRowData(val, 'phone'),
        },
      },
      {
        fieldName: 'website',
        headerName: 'Website',
        cellRenderer: InputCellRenderer,
        cellRendererParams: {
          onValueChange: (val: any) => this.onUpdateRowData(val, 'website'),
        },
      },
      {
        fieldName: 'status',
        headerName: 'Status',
        cellRenderer: SingleSlect,
        cellRendererParams: {
          optionList: this.optionList,
          onValueChange: (val: any) => this.onUpdateRowData(val, 'status'),
        },
      },
      {
        fieldName: 'Action',
        headerName: 'Action',
        cellRenderer: Actionrender,
        filterable: false,
        cellRendererParams: {
          edit: (row: any) => this.editRow(row),
          update: (row: any) => this.updateRow(row),
          delete: (row: any) => this.deleteRow(row),
        },
      },
    ];
  }

  // ---------------- EVENTS ----------------
  onUpdateRowData(value: any, field: string) {
    this.flagValueChanged = true;
    this.updateRowDataObject = {
      ...this.updateRowDataObject,
      [field]: value,
    };
  }

  editRow(row: any) {
    this.rowData = this.rowData.map((r) => (r.id === row.id ? { ...r, isInEdit: true } : r));

    this.updateRowDataObject = { ...row };
    this.flagValueChanged = false;
  }

  updateRow(row: any) {
    const updatedData = this.updateRowDataObject;

    this.apiService.updateUser(row.id, updatedData).subscribe(() => {
      this.rowData = this.rowData.map((r) =>
        r.id === row.id ? { ...r, ...updatedData, isInEdit: false } : r
      );

      this.updateRowDataObject = {};
      this.flagValueChanged = false;
    });
  }

  deleteRow(row: any) {
    this.apiService.deleteUser(row.id).subscribe(() => {
      this.rowData = this.rowData.filter((r) => r.id !== row.id);
    });
  }
  onSelectiondata(event: any) {
    console.log(event);
  }

  closeConnectionWizard(e: any) {
    this.modalService.hide();
  }
  addUserModal(modal: any) {
    this.modalService.show(modal, {
      class: 'largeModel modal-dialog-centered',
      backdrop: true,
    });
  }
}
