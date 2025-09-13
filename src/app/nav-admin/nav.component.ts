import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavAdminComponent implements OnInit{
  isMenuOpen = false;
  
  constructor(private authService:AuthService, private router:Router){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  logout() {
    this.authService.removeToken();
    this.router.navigateByUrl('/login');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    console.log("close menu");
  }
}
