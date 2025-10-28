import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private authService: AuthService, private router: Router) { }
  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }
isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
}
