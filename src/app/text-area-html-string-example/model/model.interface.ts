export interface ITable {
    column1: string;
    column2: string;
    column3: string;
    column4: string;
}

export enum EditMode {
    DML = 1,
    COLUMN = 2,
    TABLE = 5,
    FROM = 3,
    WHERE = 4
}

export interface EditEvent {
    event: any;
    data: any;
    caretPosition?: number;
}
