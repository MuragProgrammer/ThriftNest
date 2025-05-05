export class User {
    id?: string;
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'user';
    token?: string;
}
