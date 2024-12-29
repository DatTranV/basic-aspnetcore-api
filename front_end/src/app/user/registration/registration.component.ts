import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styles: ``,
})
export class RegistrationComponent {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    // Khởi tạo form trong constructor sau khi formBuilder được inject
    this.form = this.formBuilder.group({
      fullName: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
    });
  }
  onSubmit() {
    console.log(this.form.value);
  }
}
