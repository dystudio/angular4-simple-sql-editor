import { Injectable } from '@angular/core';

@Injectable()
export class TextAreaService {

    constructor() { }

    createTextDom(targetElement: any, text: string, classString?: string, beforEl?: any): any {
        const currentTextDom = document.createElement('SPAN');
        const textNode = document.createTextNode(text);
        currentTextDom.appendChild(textNode);
        currentTextDom.className = classString;
        // 입력되는 다음에 space 추가
        const spaceDom = document.createElement('SPAN');
        const spaceNode = document.createTextNode('  ');
        spaceDom.appendChild(spaceNode);
        if (!beforEl) {
            targetElement.appendChild(currentTextDom);
        } else {
            beforEl.insertAdjacentElement('afterEnd', currentTextDom);
        }
        return currentTextDom;
    }

    getPosition(element: any) {
        return getCaretPosition(element);
    }

    getElementIndex(targetElement: any, findElement: any): number {
        return Array.prototype.indexOf.call(targetElement.childNodes, findElement);
    }

    setCaretPosition(targetEl: any, index: number = 0) {
        const node = targetEl;
        node.focus();
        const textNode = node.firstChild;
        const range: any = document.createRange();
        range.setStart(textNode, index);
        range.setEnd(textNode, index);
        const sel: any = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    setElementAfterFocus(targetEl: any, focusEl: any) {
        const range = document.createRange();
        const node = focusEl;
        range.setStartAfter(node);
        const sel = window.getSelection();
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        targetEl.focus();
    }

    setLastFocus(targetEl: any) {
        const range = document.createRange();
        const node = targetEl.lastChild;
        range.setStartAfter(node);
        const sel = window.getSelection();
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        targetEl.focus();
    }
}

// tslint:disable-next-line:typeof-compare
const ie = (typeof (document as any).selection !== 'undefined' && (document as any).selection.type !== 'Control') && true;
const w3 = (typeof window.getSelection !== 'undefined') && true;

export function getCaretPosition(element) {
    let caretOffset = 0;
    if (w3) {
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (ie) {
        console.log('ie');
        const textRange = (document as any).selection.createRange();
        const preCaretTextRange = (document as any).body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint('EndToEnd', textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
