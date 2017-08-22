import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DML, TABLE_NAMES, TEST_TABLE1, TEST_TABLE2, TEST_TABLE1_COLUMNS, TEST_TABLE2_COLUMNS } from './data/backend-data';

export function FakeBackendFactory(backend: MockBackend, options: BaseRequestOptions) {

    const data: any = {
        'tables': TABLE_NAMES,
        'test_table1': TEST_TABLE1,
        'test_table2': TEST_TABLE2,
        'dml': DML,
        'test_table1_columns': TEST_TABLE1_COLUMNS,
        'test_table2_columns': TEST_TABLE2_COLUMNS
    };

    backend.connections.subscribe((connection: MockConnection) => {
        setTimeout(() => {
            console.log('connection subscribe => ', connection.request.url);
            if (connection.request.url.indexOf('/api/dml') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['dml'] })
                ));
            } else if (connection.request.url.indexOf('/api/tables') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['tables'] })
                ));
            } else if (connection.request.url.indexOf('/api/test_table1/columns') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['test_table1_columns'] })
                ));
            } else if (connection.request.url.indexOf('/api/test_table2/columns') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['test_table2_columns'] })
                ));
            } else if (connection.request.url.indexOf('/api/test_table2') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['test_table2'] })
                ));
            } else if (connection.request.url.indexOf('/api/test_table1') > -1 && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: data['test_table1'] })
                ));
            }
        }, 300);
    });
    return new Http(backend, options);
}

export let FakeBackendProvider = {
    provide: Http,
    useFactory: FakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions]
};
