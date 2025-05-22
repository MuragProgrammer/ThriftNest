import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '@app/_models/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.userSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      // Set current user in localStorage & BehaviorSubject
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.userSubject.next(user);

      return of(true);
    } else {
      return throwError(() => new Error('Invalid username or password'));
    }
  }
  setStaticAdmin() {
    const adminUser: User = {
        id: 'admin_static',
        username: 'admin',
        role: 'admin',
        fullName: 'Administrator',
        email: 'admin@example.com',
        token: 'static-admin-token'
    };
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    this.userSubject.next(adminUser); // 🔥 Triggers reactivity
  }



  logout(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: any): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.username === user.username);

    if (userExists) {
      return throwError(() => new Error('Username already exists'));
    }

    // Generate unique ID (using timestamp + random string)
    const uniqueId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

    const newUser = {
      id: uniqueId,
      ...user
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return of(newUser);
  }


  update(id: string, updatedData: Partial<User>) {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.map(user => user.id === id ? { ...user, ...updatedData } : user);
    localStorage.setItem('users', JSON.stringify(users));

    if (id === this.userValue?.id) {
      const updatedUser = { ...this.userValue, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.userSubject.next(updatedUser);
    }
  }

  delete(id: string) {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(users));

    if (id === this.userValue?.id) {
      this.logout();
    }
  }

  getAll(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  getById(id: string): User | undefined {
    return this.getAll().find(user => user.id === id);
  }
}
