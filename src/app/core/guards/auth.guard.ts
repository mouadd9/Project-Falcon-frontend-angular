import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectAuthState } from "../../features/auth/state/auth.selectors";
import { map, Observable, take, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private store = inject(Store);
    private router = inject(Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean | UrlTree> {
        console.log("guard called ... ")
      return this.store.select(selectAuthState).pipe(
            take(1),
            map(authState => {
                if (authState.isLoggedIn) {
                    return true;
                }
                console.log("oops, you are not logged, Go back !!! ")
                return this.router.createUrlTree(['/auth/sign-in']);
            })
        );
    }
} 



/*
The Angular Router itself will subscribe to the observable returned by the canActivate method. This is handled automatically by Angular's routing infrastructure.

When a user tries to navigate to a route protected by the AuthGuard, here's what happens:

The Router intercepts the navigation attempt
It checks if there are any guards on the route
If it finds our AuthGuard, it calls its canActivate method
The Router then subscribes to the observable we return
Based on the emitted value:
If true: the navigation continues
If false: the navigation is cancelled
If UrlTree: the Router redirects to that URL instead
You don't need to manage the subscription yourself - Angular handles all of this internally. This is why we use take(1) in our pipe to ensure the observable completes after the first emission, so Angular can clean up the subscription properly.



*/