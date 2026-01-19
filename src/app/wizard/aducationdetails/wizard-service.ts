import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
interface WizardData {
    [stepKey: string]: any;
}
@Injectable({
    providedIn: 'root',
})
export class WizardService {
    private url = 'https://top100movies-5f84e.web.app/city/allcountries';


    public stepData: WritableSignal<WizardData> = signal({});
    constructor(private modalService: BsModalService, private http: HttpClient) { }



    closeConnectionWizard() {
        this.modalService.hide();
    }
    getCountry(): Observable<any> {
        return this.http.get(this.url);
    }

    getStatedata(countryCode: any): Observable<any> {
        return this.http.get(
            `https://top100movies-5f84e.web.app/city/states-by-countrycode?countrycode=${countryCode}`
        );
    }

    getCity(countryCode: any, StateCode: any): Observable<any> {
        return this.http.get(
            `https://top100movies-5f84e.web.app/city/cities-by-countrycode-and-statecode?countrycode=${countryCode}&statecode=${StateCode}`
        );
    }


    setCurrentWizardData(stepDataPayload: { stepKey: string; data: any }) {
        this.stepData.update((currentData) => {
            return {
                ...currentData,
                [stepDataPayload.stepKey]: stepDataPayload.data,
            };
        });
    }
}
