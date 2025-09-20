import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;
    this.authService.login(this.loginForm.value).subscribe({
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error(err);
      }
    });
  }

  // These methods redirect to the WebApp backend to initiate the SSO flow
  loginWithMicrosoft(): void {
    window.location.href = '/auth/microsoft-login';
  }

  loginWithGoogle(): void {
    window.location.href = '/auth/google-login';
  }
}
