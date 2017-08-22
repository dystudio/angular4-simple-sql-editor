export class EditUtils {

    static getWordForIndex(text: string, index: number): number {
        const prevText = text.substring(0, index);
        const words = prevText.split(' ');
        const realWords = [];
        let spaceCnt = 0;
        let pushCnt = -1;
        // space split warning T.T
        for ( let i = 1; i < words.length - 1; i++ ) {
            realWords.push(words[i]);
            pushCnt++;
            if (words[i] === '') {
                spaceCnt++;
            }
            if (spaceCnt > 2) {
                spaceCnt = 0;
                realWords.splice(pushCnt, i);
                pushCnt--;
            }
        }
        console.log(index, '  getWordForIndex : ', prevText.length, prevText, index, realWords);
        return realWords.length;
    }

    static checkingWord(text: string, word: string): boolean {
        const reg = new RegExp(word);
        const testing: boolean = reg.test( text );
        return testing;
    }

    static setCaretPosition(targetEl: any, index: number = 0) {
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

    static setLastFocus(targetEl: any) {
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
