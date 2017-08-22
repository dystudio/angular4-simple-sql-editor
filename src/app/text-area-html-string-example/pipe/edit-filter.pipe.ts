import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})
export class EditFilterPipe implements PipeTransform {
    transform(items: any, filter: any): any {
        console.log('1. pipe : ', items, filter);
        if (filter && Array.isArray(items)) {
            console.log('2. pipe : ', items, filter);
            return items.filter(item => {
                if ((new RegExp(filter, 'gi').test(item)) || filter === '') {
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            return items;
        }
    }
}
