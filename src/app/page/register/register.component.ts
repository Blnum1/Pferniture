import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  repeatPass: string = 'none';
  constructor() { }

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
    if (this.Pwd.value == this.Rpwd.value) {
      console.log("Sumited");
      this.repeatPass = 'none';
    } else {
      this.repeatPass = 'inline';
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
