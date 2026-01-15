import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class UsersService {
    private _http = inject(HttpClient);

    getAll(): Observable<any[]> {
        return this._http.get<any[]>(`${environment.baseUrl}/users`);
    }
}