import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from "./app-routing.module";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.auth.loadCurrentUser(); 
  }
  title = 'Pferniture';
}
