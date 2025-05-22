﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService, AlertService } from '@app/_services';
@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    error = '';   // <-- add this line

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.form.controls;
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        this.error = '';

        if (this.form.invalid) return;

        const { username, password } = this.form.value;

        // Static admin account check
        if (username === 'admin' && password === 'admin123') {
            this.accountService.setStaticAdmin();
            this.router.navigate(['/admin']);
            return;
        }

        this.loading = true;

        // Normal user login
        this.accountService.login(username, password)
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: err => {
                    this.error = 'Invalid username or password.';
                    this.loading = false;
                }
            });
    }
}
