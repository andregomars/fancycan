import { Component, OnInit } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ObservableArray } from "tns-core-modules/data/observable-array";

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
  moduleId: module.id,
})
export class VehicleListComponent implements OnInit {
	searchHint = 'Search for vehicle id and press enter';
	myItems: ObservableArray<DataItem> = new ObservableArray<DataItem>();
	private arrayItems: Array<DataItem> = [];

	constructor() {
		const count = 20;
		for (let i = 0; i < count; i++) {
			
			const code = 'A' + this.zeroFill(i, 2);
			this.arrayItems.push(new DataItem(code));
		}

		this.myItems = new ObservableArray<DataItem>(this.arrayItems);
	}

	ngOnInit() {}

	public onSubmit(args) {
		let searchBar = <SearchBar>args.object;
		let searchValue = searchBar.text.toLowerCase();

		this.myItems = new ObservableArray<DataItem>();
		if (searchValue) {
			for (let i = 0; i < this.arrayItems.length; i++) {
				if (this.arrayItems[i].name.toLowerCase().indexOf(searchValue) !== -1) {
					this.myItems.push(this.arrayItems[i]);
				}
			}
		}
	}

	public onClear(args) {
		let searchBar = <SearchBar>args.object;
		searchBar.text = '';
		searchBar.hint = this.searchHint;

		this.myItems = new ObservableArray<DataItem>();
		this.arrayItems.forEach(item => {
			this.myItems.push(item);
		});
	}

	private zeroFill(num: number, width: number) {
		width -= num.toString().length;
		if (width > 0) {
			return new Array(width + (/\./.test(num.toString()) ? 2 : 1)).join('0') + num;
		}
		return num + ""; // always return a string
	}
}

export class DataItem {
	constructor(public name: string) { }
}
