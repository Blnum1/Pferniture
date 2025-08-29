import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {



  constructor(private loginAuth : AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
  });

  isUserValid: boolean = true;
  
  loginSubmit() {
    this.loginAuth.loginUser([this.loginForm.value.email, this.loginForm.value.pwd])
    .subscribe(res => {
      if(res == 'Failure') {
        this.isUserValid = false;
        alert('Login Unsuccessful');
      }else {
        this.isUserValid = true;
        this.loginAuth.setToken(res);
         const userRole = this.loginAuth.currentUser.value?.role;
        if (userRole === 'Admin') {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['']);
        }
      }
    });
  }

  
  get Pwd(): FormControl {
    return this.loginForm.get("pwd") as FormControl;
  } 
  get Email(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }
}

  