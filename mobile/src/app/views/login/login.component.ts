import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { TextField } from "tns-core-modules/ui/text-field";
import { Page } from "tns-core-modules/ui/page";
import { prompt, inputType } from "tns-core-modules/ui/dialogs";
import { isAndroid, device } from "tns-core-modules/platform";
import * as app from "tns-core-modules/application";

import { UtilityService } from "../../services/utility.service";
import { User } from "~/app/models/user";

declare var android: any;

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

    @ViewChild('password') passwordField: ElementRef;
    @ViewChild('email') emailField: ElementRef;

    user: User;
    isAuthenticating = false;

    public hideIcon = String.fromCharCode(0xf070);
    public showIcon = String.fromCharCode(0xf06e);
    public showHideIcon: any;
    private showPassword = false;

    emailError = "";
    passError = "";
    loginError = "";

    emailHasFocus = false;
    passHasFocus = false;

    constructor(
      private utilityService: UtilityService,
      private page: Page,
      private routerExtensions: RouterExtensions,
    ) {
        this.user = new User();
        this.user.email = "guest@fancycan.com";
        this.user.password = "11111111";
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.page.cssClasses.add("login-page-background");
        this.page.backgroundSpanUnderStatusBar = true;
        this.showHideIcon = this.hideIcon;

        if (isAndroid && device.sdkVersion >= '21') {
            var View = android.view.View;
            var window = app.android.startActivity.getWindow();
            window.setStatusBarColor(0x000000);

            var decorView = window.getDecorView();
            decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }

    public hasEmailErrors() {
        const hasErrorMsg = !!this.emailError;
        if (!hasErrorMsg)
            return false;

        const isValidEmail = this.user.hasEmail() && this.utilityService.isValidEmail(this.user.email);
        let hasError = hasErrorMsg || !isValidEmail;

        if (isValidEmail) {
            this.emailError = ""
            return false;
        }

        return hasError;
    }

    public hasPasswordErrors() {
        const hasErrorMsg = !!this.passError;
        if (!hasErrorMsg)
            return false;

        const isValidPassword = this.user.password.length > 0;
        let hasError = hasErrorMsg || !isValidPassword;

        if (isValidPassword) {
            this.passError = ""
            return false;
        }

        return hasError;
    }

    getEmailError() {
        return this.emailError;
    }

    getPasswordError() {
        return this.passError;
    }

    onEmailFocus() {
        this.emailHasFocus = true;
    }

    onPasswordFocus() {
        this.passHasFocus = true;

        this.updateErrors(false);
    }

    updateErrors(checkPass) {
        if (this.user.hasEmail()) {
            if (this.utilityService.isValidEmail(this.user.email)) {
                this.emailError = "";
            } else {
                this.emailError = "Invalid Email"
            }
        } else {
            this.emailError = "Email cannot be blank"
        }

        if (checkPass) {
            let length = this.user.password.length;
            if (length == 0) {
                this.passError = "Password cannot be blank";
            } else {
                this.passError = "";
            }
        }
    }

    hasLoginErrors() {
        return !!this.loginError;
    }

    getLoginError() {
        return this.loginError;
    }

    private isValidForm() {
        let isValid = !!this.emailError || !!this.passError;
        return !isValid;
    }

    showHidePassword() {
        this.showPassword = !this.showPassword;
        this.showHideIcon = this.showPassword ? this.showIcon : this.hideIcon;
        let passField: TextField = this.passwordField.nativeElement;
        passField.secure = !passField.secure;
    }

    login() {
        this.updateErrors(true);
        // const url = '/main/default/(vehicleTab:vehicle//settingTab:setting//checklistTab:checklist)';

        if (this.isValidForm()) {
            this.isAuthenticating = true;
            // Use the backend service to login
            // this.backendService.loginWithKinvey(this.user)
            //     .then(() => {
                    this.isAuthenticating = false;
                    this.routerExtensions.navigate(['/main/default'], { clearHistory: true });
                // }).catch(error => {
                //     this.isAuthenticating = false;
                //     this.loginError = error.message;
                // });
        }
    }

    isSubmitEnabled() {
        return !this.isAuthenticating && this.utilityService.isValidEmail(this.user.email);
    }

    isTablet() {
        return this.utilityService.isTablet();
    }

    // for this to work, you must configure email field in Kinvey Users
    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register to reset your password.",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel",
            inputType: inputType.email
        }).then((data) => {
            if (data.result) {
                // this.backendService.forgetPassword(data.text.trim())
                //     .then(() => {
                        alert("An email has been sent to your email address. Please check your email for instructions on resetting your password.");
                //     }, () => {
                //         alert("Unfortunately, an error occurred resetting your password.");
                //     });
            }
        });
    }
}

