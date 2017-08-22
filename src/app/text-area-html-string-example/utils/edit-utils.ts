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
        return realWords.length;
    }
}
