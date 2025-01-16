import { Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule, NgIf, FirstKeyPipe, RouterLink],
  templateUrl: './registration.component.html',
  styles: ``,
})
export class RegistrationComponent {
  form: FormGroup;
  isSubmitted: boolean = false;
  constructor(public formBuilder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService
  ) {
    // Khởi tạo form trong constructor sau khi formBuilder được inject
    
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
            Validators.minLength(6),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  
     passwordMatchValidator: ValidatorFn = (
       control: AbstractControl
     ): null => {
       const password = control.get('password');
       const confirmPassword = control.get('confirmPassword');

       if (
         password &&
         confirmPassword &&
         password.value !== confirmPassword.value
       )
         confirmPassword?.setErrors({ passwordMismatch: true });
       else confirmPassword?.setErrors(null);
       return null;
     };
   
  
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value)
      .subscribe({
        next: (res:any) => {
          if(res.succeeded){
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('User created successfully!', 'User Registration');
          }  
        },
        error: err => {
          if (err.error.errors){
        err.error.errors.forEach((x: any) => {
          switch (x.code) {
            case 'DuplicateUserName':
              break;
            case 'DuplicateEmail':
              this.toastr.error(
                'Email is already taken',
                'Registration failed'
              );
              break;
            default:
              this.toastr.error('Contact the developer', 'Registration failed');
              console.log('error', x);
              break;
          }
        });
        }
        else{
          console.log(err);
        }}
      })
      ;
    }
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }
}
