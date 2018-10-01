import { NgModule } from "@angular/core";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthService } from "./auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthGuard } from "./auth-guard.service";


@NgModule({
    declarations:[
        SignInComponent,
        SignUpComponent
    ],
    imports:[
       CommonModule,
       ReactiveFormsModule,
       FormsModule,
       AuthRoutingModule
    ],
    providers:[AuthService,AngularFireAuth,AuthGuard]
})
export class AuthModule{}