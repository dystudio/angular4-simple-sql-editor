import { Table } from '../../model/index';

export const DML: string[] = [
    'SELECT', 'INSERT', 'DELETE', 'UPDATE'
];

export const TABLE_NAMES: Array<string> = [
    'test_table1', 'test_table2'
];

export const TEST_TABLE1: Array<Table> = [
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4')
];

export const TEST_TABLE2: Array<Table> = [
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4'),
    new Table('column1', 'column2', 'column3', 'column4')
];

// export const USER_TABLE_COLUMNS: string[] = Object.keys(USER_LIST[0]);
export const TEST_TABLE1_COLUMNS: string[] = ['column1', 'column2', 'column3', 'column4'];

// export const SHOP_TABLE_COLUMNS: string[] = Object.keys(SHOP_LIST[0]);
export const TEST_TABLE2_COLUMNS: string[] = [...TEST_TABLE1_COLUMNS];
