import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.css'
})
export class NavHeaderComponent {

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
  
  constructor(private authService: AuthService, private router: Router) { }
  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }
}
