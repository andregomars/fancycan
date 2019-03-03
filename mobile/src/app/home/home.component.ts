import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "app-home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    constructor(
        private routerExtensions: RouterExtensions
    ) {
    }

    ngOnInit() {
    }

    logout() {
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}
