import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public registerForm: FormGroup;


  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.initForm();
  }

  tryRegister(value) {
    this.authService.doRegister(value)
      .then(res => {
        this.toastr.success('Succcessfully Created');

      }, err => {
        this.toastr.error('An error occured');
      })
  }

  onFacebookSignUp() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.toastr.success('Succcessfully Created');
      }, err => {
        this.toastr.error('An error occured');
      })
  }





  private initForm() {
    //init Reactive Form
    this.registerForm = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

}
