import { ITable } from './model.interface';

export class Table implements ITable {

    private _column1: string;
    private _column2: string;
    private _column3: string;
    private _column4: string;

    constructor(column1: string, column2: string, column3: string, column4: string) {
        this.column1 = column1;
        this.column2 = column2;
        this.column3 = column3;
        this.column4 = column4;
    }

    get column1(): string {
        return this._column1;
    }

    set column1(value: string) {
        this._column1 = value;
    }

    get column2(): string {
        return this._column2;
    }

    set column2(value: string) {
        this._column2 = value;
    }

    get column3(): string {
        return this._column3;
    }

    set column3(value: string) {
        this._column3 = value;
    }

    get column4(): string {
        return this._column4;
    }

    set column4(value: string) {
        this._column4 = value;
    }
}
