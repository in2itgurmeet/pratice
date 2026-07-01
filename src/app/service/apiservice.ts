import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Apiservice {
   private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
isEditMode: boolean = false;


  closeModal(){

  }
 

  checkSchedulerName(value: any): any {

  }


  getTargetDropDown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/target-dropdown`);
  }

  getFrequencyDropDwon(): Observable<any> {
    return this.http.get(`${this.apiUrl}/frequency-dropdown`);
  }

  getOperationsDropDown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/operations-dropdown`);
  }

  getEmailsList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/emails`);
  }

  getAllGroupList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/device_group`);
  }

  createScheduler(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedulers`, payload);
  }

  updateScheduler(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/schedulers/${id}`, payload);
  }

  createScduler(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/scheduler`, payload);
  }

  getAllSchduler(): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedulers`);
  }
  getSchedulerById(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedulers/${id}`);
  }
}
