import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';
import { ForecastService } from '../../services/forecast';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="app-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <h1>SmartShelfX</h1>
          <span>Inventory System</span>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active" (click)="navigate('/dashboard')">
            <mat-icon>dashboard</mat-icon> Dashboard
          </a>
          <a class="nav-item" (click)="navigate('/products')">
            <mat-icon>inventory_2</mat-icon> Products
          </a>
          <a class="nav-item" (click)="navigate('/stock')">
            <mat-icon>swap_horiz</mat-icon> Stock Transactions
          </a>
          <a class="nav-item" (click)="navigate('/forecast')">
            <mat-icon>trending_up</mat-icon> Demand Forecast
          </a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" (click)="logout()">
            <mat-icon>logout</mat-icon> Logout
          </a>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main-content">
        <div class="page-header">
          <h2>Dashboard</h2>
          <p>Welcome back — here's your inventory overview</p>
        </div>
        <div class="page-body">

          <!-- STAT CARDS -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px">
            <div class="stat-card">
              <div class="label">Total Products</div>
              <div class="value" style="color:#4f8ef7">{{ totalProducts }}</div>
              <div class="sub"><a style="color:#4f8ef7;cursor:pointer" (click)="navigate('/products')">View all →</a></div>
            </div>
            <div class="stat-card">
              <div class="label">Low Stock Alerts</div>
              <div class="value" style="color:#ef4444">{{ lowStockCount }}</div>
              <div class="sub"><a style="color:#ef4444;cursor:pointer" (click)="navigate('/products')">View alerts →</a></div>
            </div>
            <div class="stat-card">
              <div class="label">High Risk Products</div>
              <div class="value" style="color:#f97316">{{ highRiskCount }}</div>
              <div class="sub"><a style="color:#f97316;cursor:pointer" (click)="navigate('/forecast')">View forecast →</a></div>
            </div>
          </div>

          <!-- LOW STOCK TABLE -->
          <div class="section-header">
            <h3>Low Stock Products</h3>
          </div>
          <div class="data-table-wrap" *ngIf="lowStockProducts.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of lowStockProducts">
                  <td>{{ p.name }}</td>
                  <td>{{ p.category }}</td>
                  <td style="color:#ef4444;font-weight:600">{{ p.currentStock }}</td>
                  <td>{{ p.reorderLevel }}</td>
                  <td><span class="badge badge-low">LOW</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="lowStockProducts.length === 0" style="color:#94a3b8;font-size:14px;padding:16px 0">
            🎉 All products are sufficiently stocked!
          </div>

        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalProducts = 0; lowStockCount = 0; highRiskCount = 0; lowStockProducts: any[] = [];

  constructor(private productService: ProductService, private forecastService: ForecastService,
    private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({ next: (d) => { this.totalProducts = d.length; this.cdr.detectChanges(); } });
    this.productService.getLowStockProducts().subscribe({ next: (d) => { this.lowStockCount = d.length; this.lowStockProducts = d; this.cdr.detectChanges(); } });
    this.forecastService.getHighRiskProducts().subscribe({ next: (d) => { this.highRiskCount = d.length; this.cdr.detectChanges(); }, error: () => { this.highRiskCount = 0; this.cdr.detectChanges(); } });
  }

  navigate(path: string) { this.router.navigate([path]); }
  logout() { this.authService.logout(); }
}
