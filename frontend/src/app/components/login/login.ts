import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-bg">
      <div class="auth-card">
        <h1>SmartShelfX</h1>
        <p>Inventory Management System — Sign in to continue</p>

        <div class="form-field" style="margin-bottom:16px">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="admin@example.com">
        </div>
        <div class="form-field" style="margin-bottom:24px">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" placeholder="••••••••">
        </div>

        <button class="btn btn-primary" style="width:100%;justify-content:center" (click)="login()">
          Sign In
        </button>

        <div *ngIf="error" style="margin-top:12px;color:#ef4444;font-size:13px;text-align:center">{{ error }}</div>

        <div class="auth-link">
          Don't have an account? <a (click)="goToRegister()">Register here</a>
        </div>
      </div>
    </div>
    <div *ngIf="toast" class="snack">{{ toast }}</div>
  `
})
export class LoginComponent {
  email = ''; password = ''; error = ''; toast = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (token) => { this.authService.saveToken(token); this.router.navigate(['/dashboard']); },
      error: () => { this.error = 'Invalid email or password. Please try again.'; }
    });
  }

  goToRegister() { this.router.navigate(['/register']); }
}
