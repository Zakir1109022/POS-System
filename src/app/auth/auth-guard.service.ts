import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Route } from "@angular/compiler/src/core";

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {

    constructor(private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.isAuthenticate();
    }

    canLoad(route: Route) {
        return this.authService.isAuthenticate();
    }
}