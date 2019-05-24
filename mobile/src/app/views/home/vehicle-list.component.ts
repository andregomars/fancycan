import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { DataService } from '~/app/services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from '~/app/services/utility.service';

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
	vStates = [];
	private arrayItems: Array<DataItem> = [];
	private fcode = 'BYD';

	constructor(
		private page: Page,
		private dataService: DataService,
		private utilityService: UtilityService
	) {
	}

	ngOnInit() {
		// this.loadVehicleCodes(this.fcode).subscribe(vcodes => { 
		// 	vcodes.forEach(vcode => this.arrayItems.push(new DataItem(vcode)));
		// 	this.myItems = new ObservableArray<DataItem>(this.arrayItems);
		// });

		const vcodes = this.utilityService.getVehicleCodes();
		vcodes.forEach(vcode => this.arrayItems.push(new DataItem(vcode)));
		this.myItems = new ObservableArray<DataItem>(this.arrayItems);
		this.loadVehicleStates(this.fcode);
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
		const searchBar = <SearchBar>this.page.getViewById('searchBar');
		searchBar.dismissSoftInput();
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

	private loadVehicleStates(fcode: string) {
		this.dataService.getVehicleStates(fcode).subscribe(states => {
			this.vStates = states;
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
