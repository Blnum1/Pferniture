import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  repeatPass: string = 'none';

  displayMsg: string = '';
  isAccountCreated: boolean = false;

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void { }

  registerForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Zก-๙]+$')]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Zก-๙]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phonenumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]),
    pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    rpwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
  });

  registerSubmit() {
    if (this.registerForm.valid) {
      if (this.Pwd.value === this.Rpwd.value) {
        console.log(this.registerForm.valid);
        this.repeatPass = 'none';
        
        const userData = {
          FirstName: this.Firstname.value,
          LastName: this.Lastname.value,
          Email: this.Email.value,
          Phone: this.Phonenumber.value,
          Pwd: this.Pwd.value 
        };

        this.authService.registerUser(userData).pipe(
          catchError(error => {
            console.error('API call failed', error);
            this.displayMsg = 'Something went wrong. Please try again later.';
            this.isAccountCreated = false;
            return of(null);
          })
        ).subscribe(res => {
          // ตรวจสอบข้อมูลที่ได้จาก API และเปรียบเทียบ
          if (res == "Success") {
            this.displayMsg = "Registration successful";
            this.isAccountCreated = true;
            this.router.navigate(['login']);
          } else if (res == "Already Exist") {
            this.displayMsg = 'Account with this email already exists.';
            this.isAccountCreated = false;
          } else{
            this.displayMsg = 'Registration failed. Please try again.';
            this.isAccountCreated = false;
          }
        });
        
      } else {
        this.repeatPass = 'inline';
      }
    } else {
        console.log("Form is not valid");
    }
  }

  get Firstname(): FormControl {
    return this.registerForm.get('firstname') as FormControl;
  }
  get Lastname(): FormControl {
    return this.registerForm.get('lastname') as FormControl;
  }
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get Phonenumber(): FormControl {
    return this.registerForm.get('phonenumber') as FormControl;
  }
  get Pwd(): FormControl {
    return this.registerForm.get('pwd') as FormControl;
  }
  get Rpwd(): FormControl {
    return this.registerForm.get('rpwd') as FormControl;
  }
}