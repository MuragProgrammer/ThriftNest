import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;
    isCollapsed = false;


    constructor(private accountService: AccountService, private router: Router) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
        this.router.navigate(['/login']);
    }
}