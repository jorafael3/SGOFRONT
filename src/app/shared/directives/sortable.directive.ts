import { Directive, EventEmitter, Input, Output } from '@angular/core';

export type SortColumn = keyof any;
export type SortDirection = 'asc' | 'description' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'description', description: '', '': 'asc' };

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.description]': 'direction === "description"',
		'(click)': 'rotate()',
	},
})

export class SortableDirective {
	
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}

}
