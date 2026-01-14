import { mapQueryParams } from '@/common/utils/query-params-mapper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, debtsResponse } from './interface/book.model';

@Injectable({
    providedIn: 'root',
})
export class DebtsService {
    private _http = inject(HttpClient);
    constructor() {}

    /**
     * Retrieve clients with optional query parameters.
     */
    getAll(queryparams?: Record<string, any>): Observable<debtsResponse> {
        const httpParams = mapQueryParams(queryparams);
        return this._http.get<debtsResponse>(`${environment.baseUrl}/debts`, { params: httpParams });
    }

    getBookById(Id: any) {
        return this._http.get(`${environment.baseUrl}/debts/${Id}`);
    }

    getFilters() {
        return this._http.get(`${environment.baseUrl}/debts/filters`);
    }

    scraping(page: number): Observable<any> {
    return this._http.get(`${environment.baseUrl}/debts/scrape-debts`, {
        params: {
            page: page.toString()
        },
    });
}

    update(clientId: any, data: any) {
        return this._http.put(`${environment.baseUrl}/clients/${clientId}`, data);
    }

    deleteBook(Id: number | undefined) {
        return this._http.delete(`${environment.baseUrl}/debts/${Id}`);
    }

    getAllInteractions(clientId: any) {
        return this._http.get(`${environment.baseUrl}/clients/${clientId}/interactions`);
    }
}
