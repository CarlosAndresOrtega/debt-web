import { mapQueryParams } from '@/common/utils/query-params-mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { debtsResponse } from './interface/book.model';

@Injectable({
    providedIn: 'root',
})
export class DebtsService {
    private _http = inject(HttpClient);

    getAll(queryparams?: Record<string, any>): Observable<debtsResponse> {
        const httpParams = mapQueryParams(queryparams);
        return this._http.get<debtsResponse>(`${environment.baseUrl}/debts`, { params: httpParams });
    }

    getDebtById(id: any): Observable<any> {
        return this._http.get(`${environment.baseUrl}/debts/${id}`);
    }

    getFilters(): Observable<any> {
        return this._http.get(`${environment.baseUrl}/debts/filters`);
    }

    createDebt(payload: any): Observable<any> {
        return this._http.post(`${environment.baseUrl}/debts`, payload);
    }

    updateDebt(id: any, payload: any): Observable<any> {
        return this._http.put(`${environment.baseUrl}/debts/${id}`, payload);
    }

    markAsPaid(id: number): Observable<any> {
        return this._http.patch(`${environment.baseUrl}/debts/${id}/pay`, {});
    }

    getStats(): Observable<any> {
        return this._http.get(`${environment.baseUrl}/debts/stats`);
    }

    deleteDebt(id: number): Observable<any> {
        return this._http.delete(`${environment.baseUrl}/debts/${id}`);
    }
}