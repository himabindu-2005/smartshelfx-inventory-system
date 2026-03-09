import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StockService } from '../../services/stock';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-stock-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-logo"><h1>SmartShelfX</h1><span>Inventory System</span></div>
        <nav class="sidebar-nav">
          <a class="nav-item" (click)="navigate('/dashboard')"><mat-icon>dashboard</mat-icon> Dashboard</a>
          <a class="nav-item" (click)="navigate('/products')"><mat-icon>inventory_2</mat-icon> Products</a>
          <a class="nav-item active" (click)="navigate('/stock')"><mat-icon>swap_horiz</mat-icon> Stock Transactions</a>
          <a class="nav-item" (click)="navigate('/forecast')"><mat-icon>trending_up</mat-icon> Demand Forecast</a>
        </nav>
        <div class="sidebar-footer"><a class="nav-item" (click)="navigate('/login')"><mat-icon>logout</mat-icon> Logout</a></div>
      </aside>

      <main class="main-content">
        <div class="page-header">
          <h2>Stock Transactions</h2>
          <p>Record and track all inventory movements</p>
        </div>
        <div class="page-body">

          <div class="section-header">
            <h3>{{ showForm ? 'New Transaction' : 'Transaction History' }}</h3>
            <button class="btn btn-primary" (click)="showForm = !showForm">
              <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
              {{ showForm ? 'Cancel' : 'Record Transaction' }}
            </button>
          </div>

          <div class="form-card" *ngIf="showForm">
            <h3>Record Stock Movement</h3>
            <div class="form-grid">
              <div class="form-field">
                <label>Product</label>
                <select [(ngModel)]="form.productId">
                  <option [value]="null" disabled>Select product</option>
                  <option *ngFor="let p of products" [value]="p.id">{{ p.name }}</option>
                </select>
              </div>
              <div class="form-field">
                <label>Transaction Type</label>
                <select [(ngModel)]="form.type">
                  <option value="IN">Stock IN</option>
                  <option value="OUT">Stock OUT</option>
                </select>
              </div>
              <div class="form-field">
                <label>Quantity</label>
                <input type="number" [(ngModel)]="form.quantity" placeholder="0">
              </div>
              <div class="form-field">
                <label>Handled By</label>
                <select [(ngModel)]="form.handledById">
                  <option [value]="null" disabled>Select user</option>
                  <option *ngFor="let u of users" [value]="u.id">{{ u.name }}</option>
                </select>
              </div>
            </div>
            <div style="display:flex;gap:12px">
              <button class="btn btn-primary" (click)="save()">Save Transaction</button>
              <button class="btn btn-outline" (click)="showForm = false">Cancel</button>
            </div>
          </div>

          <div class="data-table-wrap">
            <table>
              <thead>
                <tr><th>Product</th><th>Type</th><th>Quantity</th><th>Handled By</th><th>Stock After</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of transactions">
                  <td style="font-weight:600">{{ t.productName }}</td>
                  <td><span [class]="t.type === 'IN' ? 'badge badge-in' : 'badge badge-out'">{{ t.type }}</span></td>
                  <td>{{ t.quantity }}</td>
                  <td>{{ t.handledBy }}</td>
                  <td style="font-weight:600">{{ t.stockAfterTransaction }}</td>
                  <td style="color:#94a3b8">{{ t.timestamp | date:'MMM d, y, h:mm a' }}</td>
                </tr>
                <tr *ngIf="transactions.length === 0">
                  <td colspan="6" style="text-align:center;color:#94a3b8;padding:32px">No transactions yet.</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
    <div *ngIf="toast" class="snack">{{ toast }}</div>
  `
})
export class StockTransactions implements OnInit {
  transactions: any[] = []; products: any[] = []; users: any[] = [];
  showForm = false; toast = '';
  form: any = { productId: null, type: 'IN', quantity: 0, handledById: null };

  constructor(private stockService: StockService, private productService: ProductService,
    private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.stockService.getAllTransactions().subscribe({ next: (d) => { this.transactions = d; this.cdr.detectChanges(); } });
    this.productService.getAllProducts().subscribe({ next: (d) => { this.products = d; this.cdr.detectChanges(); } });
    this.productService.getAllUsers().subscribe({ next: (d) => { this.users = d; this.cdr.detectChanges(); } });
  }

  showToast(msg: string) { this.toast = msg; setTimeout(() => this.toast = '', 3000); }

  save() {
    this.stockService.recordTransaction(this.form).subscribe({
      next: () => {
        this.showToast('✅ Transaction recorded!');
        this.showForm = false;
        this.form = { productId: null, type: 'IN', quantity: 0, handledById: null };
        this.stockService.getAllTransactions().subscribe({ next: (d) => { this.transactions = d; this.cdr.detectChanges(); } });
      },
      error: () => this.showToast('❌ Transaction failed!')
    });
  }

  navigate(path: string) { this.router.navigate([path]); }
}
