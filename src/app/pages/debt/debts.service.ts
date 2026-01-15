import { mapQueryParams } from '@/common/utils/query-params-mapper';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DebtsResponse } from './interface/debt.model';

@Injectable({
    providedIn: 'root',
})
export class DebtsService {
    private _http = inject(HttpClient);

    getAll(queryparams?: Record<string, any>): Observable<DebtsResponse> {
        const httpParams = mapQueryParams(queryparams);
        return this._http.get<DebtsResponse>(`${environment.baseUrl}/debts`, { params: httpParams });
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
        return this._http.patch(`${environment.baseUrl}/debts/${id}`, payload);
    }

    markAsPaid(id: string, paidByUserId: string): Observable<any> {
        return this._http.patch(`${environment.baseUrl}/debts/${id}/pay`, { userId: paidByUserId });
    }

    getStats(): Observable<any> {
        return this._http.get(`${environment.baseUrl}/debts/stats`);
    }

    delete(id: string): Observable<any> {
        return this._http.delete(`${environment.baseUrl}/debts/${id}`);
    }
    exportCsv(params: any): Observable<Blob> {
        return this._http.get(`${environment.baseUrl}/debts/export/csv`, {
            params,
            responseType: 'blob',
        });
    }
}
