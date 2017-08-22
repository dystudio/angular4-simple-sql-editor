import { EditEvent } from './model.interface';

export class EditEventType implements EditEvent {

    get event(): any {
        return this._event;
    }

    set event(value: any) {
        this._event = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    get caretPosition(): number {
        return this._caretPosition;
    }

    set caretPosition(value: number) {
        this._caretPosition = value;
    }

    private _event: any;
    private _data: any;
    private _caretPosition: number;

    constructor(event: any, data: any, caretPosition?: number) {
        this.event = event;
        this.data = data;
        this.caretPosition = caretPosition;
    }
}
