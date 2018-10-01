import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

    token: string;

    constructor(
        public afAuth: AngularFireAuth,
        private router: Router
    ) { }


    //for phone verification
    get windowRef() {
        return window
      }

    //registration using email & password
    doRegister(value) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

    //registration using facebook
    doFacebookLogin() {
        return new Promise<any>((resolve, reject) => {
            let provider = new firebase.auth.FacebookAuthProvider();
            this.afAuth.auth
                .signInWithPopup(provider)
                .then(res => {
                    resolve(res);
                }, err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    //signIN with Email
    signIn(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                Response => {
                    this.router.navigate(['/'])
                    firebase.auth().currentUser.getToken()
                        .then(
                            (token: string) => this.token = token
                        )
                }
            )
            .catch(
                error => console.log(error)
            )
    }

    //signIn with facebook
    signInWithFacebook() {
        return this.afAuth.auth.signInWithPopup(
            new firebase.auth.FacebookAuthProvider()
        ).then(
            Response => {
                this.router.navigate(['/'])
                firebase.auth().currentUser.getToken()
                    .then(
                        (token: string) => this.token = token
                    )

            }
        )
            .catch(
                error => console.log(error)
            )
    }


    //phone verification
    setToken(token:string){
       this.token=token;
    }


    //logout
    logOut() {
        firebase.auth().signOut();
        this.token = null;
        this.router.navigate(['/signin']);
    }


    isAuthenticate() {
        return this.token != null;
    }


}