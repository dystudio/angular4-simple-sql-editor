import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { EditMode } from './model/index';
import 'rxjs/add/operator/map';

@Injectable()
export class TextAreaHtmlStringExampleService {

    constructor(private http: Http) { }

    getDML(): Observable<any> {
        return this.http.get(`/api/dml`)
            .map((res: Response) => {
                return res.json();
            });
    }

    getTables(): Observable<any> {
        return this.http.get(`/api/tables`)
            .map((res: Response) => {
                return res.json();
            });
    }

    getColumns(tablename: string): Observable<any> {
        return this.http.get(`/api/${tablename}/columns`)
            .map((res: Response) => {
                return res.json();
            });
    }
}

