import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {


  windowRef: any;
  verificationCode: string;
  user: any;
  @ViewChild('phone') phone: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.windowRef = this.authService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  //email & password login
  onSignIn(formData: NgForm) {
    const email = formData.value.email;
    const password = formData.value.password;
    this.authService.signIn(email, password);
  }

  //facebook login
  signInWithFacebook() {
    this.authService.signInWithFacebook();
  }

  //send login code
  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phone.nativeElement.value;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {

        this.windowRef.confirmationResult = result;

      })
      .catch(error => console.log(error));
  }

  //verify code
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {

        this.user = result.user;
        this.authService.setToken(result.user);
        this.router.navigate(['/'])

      })
      .catch(
        error => console.log(error, "Incorrect code entered?"),
       // this.toastr.error("Incorrect code entered?")
      );
  }




}
