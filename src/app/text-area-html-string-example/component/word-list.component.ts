import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-word-list-component',
    template: `
                <div class="word-list"
                     [ngStyle]="setStyles()">
                    <ul class="list-none"
                        *ngIf="isFocusing">
                        <li *ngFor="let item of items | filter:word">
                            <a class="dropdown-item" (click)="select(item);">
                                <span>{{item}}</span>
                            </a>
                        </li>
                    </ul>
                </div>
              `,
    styleUrls: ['../text-area-html-string-example.css'],
    encapsulation: ViewEncapsulation.None
})
export class WordListComponent {
    @Input() boxPosition: any;
    @Input() isFocusing: boolean;
    @Input()
    set items(value: Array<any>) {
        this._items = value;
    }

    get items(): Array<any> {
        return this._items;
    }

    @Input()
    set word(value: string) {
        this._word = value ? value.trim() : undefined;
    }

    get word(): string {
        return this._word;
    }

    @Output() wordSelect = new EventEmitter();

    private _word = '';
    private _items: Array<any>;

    constructor() { }

    select(word: any) {
        this.wordSelect.emit(word);
    }

    setStyles() {
        const styles = {
            'left': this.boxPosition.boxX + 'px',
            'top': this.boxPosition.boxY + 'px',
            'position': 'absolute'
        };

        return styles;
    }

    keyUp(event) {
        console.log('keyUp', event);
    }

}
