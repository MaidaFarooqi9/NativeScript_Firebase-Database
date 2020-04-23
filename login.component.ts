import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
//import { SnackBar } from "nativescript-snackbar";
import * as ApplicationSettings from "@nativescript/core/application-settings";//imported from nodemodules/tns-core-modules/applicationsettings
import {FirebaseService} from '../firebase.service';
import {User} from '../model';
@Component({
    moduleId: module.id,
    selector: "login",
    templateUrl: "login.component.html",
})
export class LoginFirebaseComponent implements OnInit {
    isAuthenticating = false;
    public user: User;

    public constructor(private router: RouterExtensions, private firebaseService: FirebaseService) {
        this.user = {
          "email":"",
          "password":""
        }
    }

    public ngOnInit() {
        if(ApplicationSettings.getBoolean("authenticated", false)) {
            this.router.navigate(["/home"], { clearHistory: true });
        }
    }

    public login() {
     this.firebaseService.login(this.user)
      .then(() => {
        this.isAuthenticating = true;
        ApplicationSettings.setBoolean("authenticated", true);
        this.router.navigate(["/home"], { clearHistory: true } );

      })
      .catch((message:any) => {
        this.isAuthenticating = false;
      });
  }

}
