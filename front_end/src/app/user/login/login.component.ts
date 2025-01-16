import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  form: FormGroup;
  isSubmitted: boolean = false;
  constructor(public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Khởi tạo form trong constructor sau khi formBuilder được inject

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }
  onSubmit() {
    this.isSubmitted = true;
    if(this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res:any) => {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/dashboard');
        },
        error: err => {
          if (err.status === 400) {
            this.toastr.error('Incorrect email or password', 'Login failed');
          } else {
            console.log('error during login: \n', err);
          }
        }
      })
    }
  }
}
