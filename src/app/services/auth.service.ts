import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  baseServerUrl = "http://localhost:5140/api/"
  jwtHelperService = new JwtHelperService();
  registerUser(user: any) {
    return this.http.post(this.baseServerUrl + "User/CreateUser", user, { responseType: 'text' });
  }

  loginUser(loginInfo: any) {
    return this.http.post(this.baseServerUrl + "User/LoginUser", {
      Email: loginInfo[0],
      Pwd: loginInfo[1]
    }, { responseType: 'text' });
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('access_token');
    const userInfo = token != null ? this.jwtHelperService.decodeToken(token) : null;
    const data = userInfo ? {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone,
      role: userInfo.role
    } : null;
    this.currentUser.next(data);
  }

  isLogginedIn(): boolean {
    return localStorage.getItem("access_token") ? true : false;
  }
  removeToken() {
    localStorage.removeItem('access_token');
    this.currentUser.next(null);
  }
}