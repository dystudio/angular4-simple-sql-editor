import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { EditMode } from './model/index';
import { TextAreaComponent } from './component/index';
import { TextAreaHtmlStringExampleService } from './text-area-html-string-example.service';
import { FakeBackendProvider } from './mock-backend/mock-data-backend.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { EditEventType, EditLabelDictionary } from './model/index';
import { EditUtils } from './utils/index';

@Component({
    selector: 'app-text-area-example',
    templateUrl: './text-area-html-string-example.html',
    styleUrls: ['./text-area-html-string-example.css'],
    providers: [
        TextAreaHtmlStringExampleService,
        FakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    encapsulation: ViewEncapsulation.None
})
export class TextAreaHtmlStringExampleComponent {

    @ViewChild('textarea') textareaComponent: ElementRef;

    isFocusing = false;
    isSelectbox = '';
    boxPosition = {
        boxX: 0,
        boxY: 0
    };
    mode = EditMode.DML;
    items: Array<any> = [];
    sqlText: string; // 순수 sql string

    _dmls: string[];
    _columns: string[];
    _tables: string[];
    _currentText: string; // focus start 후 입력되는 text
    _startPosition: number;
    _comment = ',';

    constructor(private textareaService: TextAreaHtmlStringExampleService) {
        this.textareaService.getDML().subscribe((res: any) => { this._dmls = res; });
        this.textareaService.getColumns('test_table1').subscribe((res: any) => { this._columns = res; });
        this.textareaService.getTables().subscribe((res: any) => { this._tables = res; });
        this.sqlText = '';
    }

    onEditStart(event: EditEventType) {
        this.mode = EditMode.DML;
        this.items = this._dmls;
        this.isFocusing = true;
        this.boxPosition = {
            boxX: 10,
            boxY: 30
        };
        this._startPosition = event.caretPosition;
        this._currentText = '';
    }

    onEditEnd(event: any) {
        // this.items = null;
        this.isFocusing = false;
    }

    onEditingFocus(event: EditEventType) {
        // const onlySelectCheck = this.keywordCheck(this._dmls.concat(['FROM', 'WHERE']), this._startPosition);
        this.sqlText = event.data;
        const onlySelectCheck = this.keywordCheck(this._dmls.concat(['FROM', 'WHERE']), this.sqlText.toUpperCase());
        // SELECT 만 있을 경우.
        if (onlySelectCheck && onlySelectCheck.length === 1 && onlySelectCheck[0].toUpperCase() === 'SELECT') {
            this.mode = EditMode.FROM;
            this.items = ['FROM'];
        } else {
            this.changeMode(event.caretPosition);
        }
        this.isFocusing = true;
        this._currentText = '';
        this._startPosition = event.caretPosition;
        const beforIndex = EditUtils.getWordForIndex( this.sqlText, this._startPosition);
        this.boxPosition = {
            boxX: 10 + ( this.textareaComponent as any).getTextWidth(beforIndex),
            boxY: 30
        };
    }

    onKeyChange(event: EditEventType) {
        if (event.event.keyCode === 8 ) { // backspace
            if (event.data === '') {
                this.disableWordList();
                return;
            }
            if (this.sqlText === '') { // string이 아무것도 없을 경우.
                this.onEditStart(null);
                return;
            }
        }
        this._currentText = event.data;
        this.isFocusing = true;
        const beforIndex = EditUtils.getWordForIndex( this.sqlText, this._startPosition); // +1
        this.boxPosition = {
            boxX: 10 + ( this.textareaComponent as any).getTextWidth(beforIndex),
            boxY: 30
        };
        if (this._currentText.toUpperCase() === 'WHERE') {
            ( this.textareaComponent as any).addText('WHERE', 'where');
        }
    }

    onWordComplete(event: EditEventType) {
        let currentWord = event.data;
        if (this._dmls.concat(['WHERE', 'FROM']).indexOf(event.data.toUpperCase()) > -1) {
            currentWord = currentWord.toUpperCase();
        }
        this._comment = '';
        this.onWordSelect(currentWord);
    }

    onKeyComplete(event: EditEventType) {
        this.sqlText = event.data;
        this._startPosition = event.caretPosition;
        // tslint:disable-next-line:max-line-length
        const onlySelectCheck = this.keywordCheck(this._dmls.concat(['FROM', 'WHERE']), this.sqlText.toUpperCase().substring(0, this._startPosition));
        // SELECT 만 있을 경우.
        if (onlySelectCheck && onlySelectCheck.length === 1 && onlySelectCheck[0].toUpperCase() === 'SELECT') {
            this.mode = EditMode.FROM;
            this.items = ['FROM'];
        } else {
            // 문장이 완성 될 때 마다 모드를 변경한다.
            this.changeMode(event.caretPosition);
        }
        this._currentText = '';
        const beforIndex = EditUtils.getWordForIndex( this.sqlText, this._startPosition);
        this.boxPosition = {
            boxX: 10 + ( this.textareaComponent as any).getTextWidth(beforIndex),
            boxY: 30
        };
    }

    onWordSelect(event: string) {
        switch (this.mode) {
            case EditMode.DML :
                ( this.textareaComponent as any).addText(event, EditLabelDictionary.DML);
            break;
            case EditMode.FROM :
                ( this.textareaComponent as any).addText(event, EditLabelDictionary.FROM);
            break;
            case EditMode.TABLE :
                ( this.textareaComponent as any).addText(event, EditLabelDictionary.TABLE);
            break;
            default :
                ( this.textareaComponent as any).addText(event + this._comment, EditLabelDictionary.COLUMN);
            break;
        }
        setTimeout(() => {
            this.disableWordList();
        }, 100);
    }

    // click 시 caret position 조정.
    rePosition = (clickElement: any, currentText: string) => {
        if (!clickElement) {
            return 0;
        }
        const checkWord = this.keywordCheck(this._dmls, currentText);
        let addPosition = 0;
        if (clickElement.className === EditLabelDictionary.FROM && checkWord.length === 1) {
            addPosition = -1;
        } else if (clickElement.className === EditLabelDictionary.DML && checkWord.length === 1) {
            addPosition = 1;
        } else if (clickElement.className === EditLabelDictionary.FROM && checkWord.length === 2) {
            addPosition = 1;
        } else if (clickElement.className === EditLabelDictionary.TABLE && checkWord.length === 2) {
            addPosition = 1;
        } else if (clickElement.className === EditLabelDictionary.WHERE && checkWord.length === 3) {
            addPosition = 1;
        }
        return addPosition;
    }

    clear() {
        this.sqlText = '';
        ( this.textareaComponent as any).clear();
    }

    private changeMode(textPosition: number) {
        const necessayWord = this._dmls.concat(['FROM', 'WHERE']).join('|');
        const necessayWordReg = new RegExp('[' + necessayWord + ']+', 'g');
        const spaceDelReq = /(\s*)/g;
        const targetString = this.sqlText.substring(0, textPosition);
        const resultNecessay = targetString.match(necessayWordReg);
        console.log('changeMode : ', resultNecessay);
        const lastword = resultNecessay ? resultNecessay[resultNecessay.length - 1] : '';
        if (!resultNecessay) {
            this.mode = EditMode.DML;
        } else {
            if (lastword === 'FROM') {
                this.mode = EditMode.TABLE;
            } else if ( lastword === 'SELECT' ) {
                this.mode = EditMode.COLUMN;
                this._comment = ',';
            } else if ( lastword === 'WHERE' ) {
                this.mode = EditMode.WHERE;
                this._comment = ' = ';
            }  else {
                this.mode = EditMode.COLUMN;
                this._comment = ',';
            }
        }
        switch (this.mode + '') {
            case EditMode.DML + '' :
                this.items = this._columns;
            break;
            case EditMode.TABLE + '' :
                this.items = this._tables;
            break;
            default :
                this.items = this._columns;
            break;
        }
    }

    private keywordCheck(words: Array<string>, text: string): Array<string> {
        const necessayWord = words.join('|');
        const necessayWordReg = new RegExp('[' + necessayWord + ']+', 'g');
        const spaceDelReq = /(\s*)/g;
        const targetString = text;
        const returnArray = targetString.match(necessayWordReg);
        console.log('keywordCheck : ', targetString, necessayWord, returnArray);
        return returnArray;
    }

    private disableWordList() {
        // this.items = null;
        this.isFocusing = false;
    }

    private getLastWord(): string {
        const words = ( this.textareaComponent as any ).getText().split(' ');
        const trimwords = words.filter((d) => {
            if (d.trim() !== '') {
                return true;
            } else {
                return false;
            }
        });
        console.log('getLastWord : ', trimwords );
        return trimwords[trimwords.length - 1];
    }

}
