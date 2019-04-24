import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { DataService } from '~/app/services/data.service';
import { Observable } from 'rxjs';
import { UtilityService } from '~/app/services/utility.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
  moduleId: module.id,
})
export class VehicleListComponent implements OnInit {
	@ViewChild("searchBar") searchBar: SearchBar;
	searchHint = 'Search for vehicle id and press enter';
	myItems: ObservableArray<DataItem> = new ObservableArray<DataItem>();
	enlargeSearchBar: boolean;
	private arrayItems: Array<DataItem> = [];
	private fcode = 'BYD';

	constructor(
		private page: Page,
		private dataService: DataService,
	) {
	}

	ngOnInit() {
		// const count = 20;
		// for (let i = 0; i < count; i++) {
		// 	const code = 'A' + this.zeroFill(i, 2);
		// 	this.arrayItems.push(new DataItem(code));
		// }
	
		this.loadVehicleCodes(this.fcode).subscribe(vcodes => { 
			vcodes.forEach(vcode => this.arrayItems.push(new DataItem(vcode)));
			this.myItems = new ObservableArray<DataItem>(this.arrayItems);
		});
	}

	onSubmit(args: any) {
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

	onClear(args: any) {
		let searchBar = <SearchBar>args.object;
		searchBar.text = '';
		searchBar.hint = this.searchHint;

		this.myItems = new ObservableArray<DataItem>();
		this.arrayItems.forEach(item => {
			this.myItems.push(item);
		});
	}

	onTap(target: string) {
		console.log('tapped: '+target);
	}

	onSearchBar(args: any) {
		this.enlargeSearchBar = true;
		this.page.actionBarHidden = true;
	}

	onTextChange(args: any) {
		this.page.actionBarHidden = true;
		this.enlargeSearchBar = true;
	}

	onCancelSearch() {
		this.enlargeSearchBar = false;
		this.page.actionBarHidden = false;
		// this.searchBar.dismissSoftInput();
	}

    private loadVehicleCodes(fcode: string): Observable<string[]> {
		const fleets$ = this.dataService.getFleets();
        return fleets$.pipe(
            map((fleets: any[]) =>
                fleets.find(fleet => fleet.code.toUpperCase() === fcode.toUpperCase())
                    .vehicles.map((vehicle: any) => vehicle.code)
            )
        );
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
