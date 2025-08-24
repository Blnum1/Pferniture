import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-admin',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavAdminComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    console.log("close menu");
  }
}
