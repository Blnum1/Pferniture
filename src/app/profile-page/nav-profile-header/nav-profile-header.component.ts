import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-profile-header',
  templateUrl: './nav-profile-header.component.html',
  styleUrls: ['./nav-profile-header.component.css']
})
export class NavProfileHeaderComponent implements OnInit {
  user$!: Observable<any>;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUser.asObservable();
  }
}
