import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false, name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: any ): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.title.toLowerCase().includes(searchText) || it.type.toLowerCase().includes(searchText)  ||
      it.totalScore?.toString().includes(searchText) || it.dueDate.toString().toLowerCase().includes(searchText);
    });
  }
}