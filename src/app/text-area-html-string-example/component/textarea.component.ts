// tslint:disable-next-line:max-line-length
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { TextAreaService } from './textarea.service';
import { TextAreaHtmlStringExampleService } from '../text-area-html-string-example.service';
import { EditEventType } from '../model/index';
import { EditUtils } from '../utils/index';

@Component({
    selector: 'app-text-area-component',
    template: `
                <div #textarea class="editor"
                    contenteditable="true"
                    (click)="onClick($event);"
                    (blur)="onblur($event);"
                    (keyup)="onKeyup($event);"></div>
              `,
    styleUrls: ['../text-area-html-string-example.css'],
    providers: [TextAreaService],
    encapsulation: ViewEncapsulation.None
})
export class TextAreaComponent {

    @Input() rePosition: any;

    @Output() editingInit = new EventEmitter();
    @Output() editingFocusOn = new EventEmitter();
    @Output() editingEnd = new EventEmitter();
    @Output() keyChange = new EventEmitter();
    @Output() keyComplete = new EventEmitter();
    @Output() wordComplete = new EventEmitter();

    @ViewChild('textarea') textareaEl: ElementRef;

    _spacer = '  ';
    _startPosition = 0;
    _endPosition = 0;
    _currentEditing = '';

    constructor(private elementRef: ElementRef,
                private textareaService: TextAreaService) {
    }

    getText(): string {
        return this.textareaEl.nativeElement.innerText;
    }

    getTextWidth(endindex?: number): number {
        let returnWidth = 0;
        const childlist: Array<any> = this.textareaEl.nativeElement.childNodes;
        let size = endindex ? endindex : childlist.length;
        if (size > childlist.length) {
            size = childlist.length;
        }
        for ( let i = 0; i < size; i++ ) {
            if (childlist[i].offsetWidth) {
                returnWidth += childlist[i].offsetWidth;
            }
        }
        return returnWidth;
    }

    addText(text: string, classString: string) {
        let newEl: any;
        let beforIndex = EditUtils.getWordForIndex( this.getText().substring(0, this._startPosition), this._startPosition);
        let beforEl = this.textareaEl.nativeElement.childNodes[beforIndex];
        if (beforEl && beforEl.className === 'from') {// 반드시 타깃이 space 여야 함.
            this._startPosition = this._startPosition - beforEl.innerText.length - 1;
            beforIndex--;
            beforEl = this.textareaEl.nativeElement.childNodes[beforIndex];
        }
        newEl = this.textareaService.createTextDom(this.textareaEl.nativeElement, text, classString, beforEl);
        const spaceEl = this.textareaService.createTextDom(this.textareaEl.nativeElement, this._spacer, 'space', newEl);
        this.textareaService.setElementAfterFocus(this.textareaEl.nativeElement, spaceEl);
        this.deleteText(this._startPosition, this._currentEditing);
        this._startPosition = this.textareaService.getPosition(this.textareaEl.nativeElement);
        this._endPosition = 0;
        this._currentEditing = '';
        setTimeout(() => {
            this.keyComplete.emit(new EditEventType(null, this.textareaEl.nativeElement.innerText, this._startPosition));
        }, 200);
    }

    deleteText(startPosition: number, deleteText: string) {
        const children = this.textareaEl.nativeElement.childNodes;
        for (let i = 0; i < children.length; i++) {
            if (children[i].className === 'space' && children[i].innerText.trim() !== '') {
                children[i].innerText = this._spacer;
            } else if (!children[i].className) {
                children[i].remove();
            }
        }
    }

    clear() {
        this._startPosition = 0;
        this._endPosition = 0;
        this._currentEditing = '';
        this.textareaEl.nativeElement.innerText = '';
    }

    onClick(event: any) {
        this._endPosition = 0;
        this._currentEditing = '';
        this._startPosition = this.textareaService.getPosition(this.textareaEl.nativeElement);
        if (!this.textareaEl.nativeElement.innerHTML) {
            const spacer = this.textareaService.createTextDom(this.textareaEl.nativeElement, this._spacer, 'space');
            this._startPosition = 2; // why? 공백문자를 넣었으므로.
            this.textareaService.setElementAfterFocus(this.textareaEl.nativeElement, spacer);
            this.editingInit.emit(new EditEventType(event, this.textareaEl.nativeElement.innerHTML, this._startPosition));
        } else {
            if (this.textareaEl.nativeElement.innerText.trim() === '') {
                this.editingInit.emit(new EditEventType(event, this.textareaEl.nativeElement.innerText, this._startPosition));
            } else {
                if (this.rePosition) {
                    // find dom of current cursor
                    // tslint:disable-next-line:max-line-length
                    const currentDomIndex = EditUtils.getWordForIndex( this.getText().substring(0, this._startPosition), this._startPosition);
                    const currentDom = this.textareaEl.nativeElement.childNodes[currentDomIndex];
                    const addIndex = this.rePosition(currentDom, this.getText().substring(0, this._startPosition));
                    if (addIndex !== 0) {
                        const nextDom = this.textareaEl.nativeElement.childNodes[currentDomIndex + addIndex];
                        this.textareaService.setElementAfterFocus(this.textareaEl.nativeElement, nextDom);
                        this._startPosition = this.textareaService.getPosition(this.textareaEl.nativeElement);
                    }
                }
                this.editingFocusOn.emit(new EditEventType(event, this.textareaEl.nativeElement.innerText, this._startPosition));
            }
        }
    }

    onblur(event: any) {
        setTimeout(() => {
            this.editingEnd.emit(new EditEventType(event, this.textareaEl.nativeElement.innerText));
        }, 500);
    }

    onKeyup(event: any) {
        if (event.keyCode === 8) {// 8 : backspace
            this._endPosition--;
            this.keyComplete.emit(new EditEventType(event, this.textareaEl.nativeElement.innerText));
            if (this._endPosition < 0) {
                this._endPosition = 0;
                this._currentEditing = '';
                return;
            }
        } else if (event.keyCode === 32) {// 32 : space
            this._startPosition = this.textareaService.getPosition(this.textareaEl.nativeElement);
            if (this._currentEditing === '') {
                this.keyComplete.emit(new EditEventType(null, this.textareaEl.nativeElement.innerText, this._startPosition));
            } else {
                this.wordComplete.emit(new EditEventType(event, this._currentEditing, this._startPosition));
            }
            return;
        } else {
            // this._startPosition = this.textareaService.getPosition(this.textareaEl.nativeElement);
            this._endPosition++;
        }
        this._currentEditing = this.textareaEl.nativeElement.innerText.substr(this._startPosition, this._endPosition);
        this.keyChange.emit(new EditEventType(event, this._currentEditing.trim()));
    }

}
