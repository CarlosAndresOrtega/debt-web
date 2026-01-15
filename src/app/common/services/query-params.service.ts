import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QueryParamsService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private _queryParams = signal<Record<string, any>>({});

    queryParams = this._queryParams.asReadonly();

    constructor() {
        this.route.queryParams
            .pipe(
                filter((params) => Object.keys(params).length > 0),
                map((params) => {
                    const processedParams: Record<string, any> = {};
                    for (const key in params) {
                        const value = params[key];

                        if (!isNaN(Number(value)) && value !== '') {
                            processedParams[key] = Number(value);
                        }
                        else if (value === 'true' || value === 'false') {
                            processedParams[key] = value === 'true';
                        }
                        else if (typeof value === 'string' && value.includes(',')) {
                            processedParams[key] = value.split(',').map((item) => item.trim());
                        }
                        else {
                            processedParams[key] = value;
                        }
                    }
                    return processedParams;
                }),
            )
            .subscribe((params) => {
                this._queryParams.set(params);
            });
    }

    /**
     * Updates query parameters
     * @param params - Object containing parameters to set
     * @param options - Router navigation options
     */
    updateParams(
        params: Record<string, any>,
        options: {
            replaceUrl?: boolean;
            merge?: boolean;
        } = { merge: true },
    ): void {
        const currentParams = options.merge ? { ...this._queryParams() } : {};

        const updatedParams = { ...currentParams, ...params };

        Object.keys(updatedParams).forEach((key) => {
            if (updatedParams[key] === null || updatedParams[key] === undefined) {
                delete updatedParams[key];
            }

            if (Array.isArray(updatedParams[key])) {
                updatedParams[key] = updatedParams[key].join(',');
            }
        });
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: updatedParams,
            replaceUrl: options.replaceUrl ?? false,
            queryParamsHandling: null, 
        });
    }

    /**
     * Clears all query parameters
     */
    clearParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
        });

        this._queryParams.set({});
    }

    /**
     * Gets a specific parameter value
     * @param key - Parameter key
     * @param defaultValue - Default value if parameter doesn't exist
     */
    getParam<T>(key: string, defaultValue?: T): T {
        const params = this._queryParams();
        return key in params ? params[key] : (defaultValue as T);
    }

    /**
     * Removes specific parameters
     * @param keys - Array of parameter keys to remove
     */
    removeParams(keys: string[]): void {
        const currentParams = { ...this._queryParams() };
    
        keys.forEach((key) => {
            delete currentParams[key];
        });
    
       
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: currentParams,
            queryParamsHandling: '', 
            replaceUrl: true
        });
    
        this._queryParams.set(currentParams);
    }

    /**
     * Checks if the current query parameters object is empty
     * @returns true if there are no query parameters, false otherwise
     */
    isEmpty(): boolean {
        return Object.keys(this._queryParams()).length === 0;
    }

    prepareFilters(filtersData: any[]): any[] {
        if (!filtersData || !Array.isArray(filtersData)) return [];
        
        const currentParams = this.queryParams();
    
        return filtersData.map((f) => ({
            ...f,
            values: f.values?.map((val: any) => ({
                ...val,
                selected: currentParams[f.queryParam]?.toString() === val.id?.toString()
            })) || []
        }));
    }
}
