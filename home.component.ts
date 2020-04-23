import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as ApplicationSettings from "@nativescript/core/application-settings";
//The application-settings module allows you to save and restore information related to your application.

@Component({
    moduleId: module.id,
    selector: "home",
    templateUrl: "home.component.html",
})
export class HomeComponent implements OnInit {

    public constructor(private router: RouterExtensions) { }

    public ngOnInit() {
        if(!ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/loginFirebase"], { clearHistory: true });
        }
    }

    public logout() {
        ApplicationSettings.remove("authenticated");
        this.router.navigate(["/loginFirebase"], { clearHistory: true });
    }

}
