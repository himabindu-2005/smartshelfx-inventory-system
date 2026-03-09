import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-logo"><h1>SmartShelfX</h1><span>Inventory System</span></div>
        <nav class="sidebar-nav">
          <a class="nav-item" (click)="navigate('/dashboard')"><mat-icon>dashboard</mat-icon> Dashboard</a>
          <a class="nav-item active" (click)="navigate('/products')"><mat-icon>inventory_2</mat-icon> Products</a>
          <a class="nav-item" (click)="navigate('/stock')"><mat-icon>swap_horiz</mat-icon> Stock Transactions</a>
          <a class="nav-item" (click)="navigate('/forecast')"><mat-icon>trending_up</mat-icon> Demand Forecast</a>
        </nav>
        <div class="sidebar-footer"><a class="nav-item" (click)="navigate('/login')"><mat-icon>logout</mat-icon> Logout</a></div>
      </aside>

      <main class="main-content">
        <div class="page-header">
          <h2>Products</h2>
          <p>Manage your product catalogue and stock levels</p>
        </div>
        <div class="page-body">

          <div class="section-header">
            <h3>{{ showForm ? (editMode ? 'Edit Product' : 'Add New Product') : 'Product List' }}</h3>
            <button class="btn btn-primary" (click)="showForm = !showForm">
              <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
              {{ showForm ? 'Cancel' : 'Add Product' }}
            </button>
          </div>

          <div class="form-card" *ngIf="showForm">
            <h3>{{ editMode ? '✏️ Edit Product' : '➕ New Product' }}</h3>
            <div class="form-grid">
              <div class="form-field"><label>Name</label><input [(ngModel)]="form.name" placeholder="Ball Point Pen"></div>
              <div class="form-field"><label>Price (₹)</label><input type="number" [(ngModel)]="form.price" placeholder="10"></div>
              <div class="form-field"><label>Category</label><input [(ngModel)]="form.category" placeholder="Stationery"></div>
              <div class="form-field"><label>Current Stock</label><input type="number" [(ngModel)]="form.currentStock" placeholder="500"></div>
              <div class="form-field"><label>Reorder Level</label><input type="number" [(ngModel)]="form.reorderLevel" placeholder="100"></div>
              <div class="form-field">
                <label>Vendor</label>
                <select [(ngModel)]="form.vendorId">
                  <option [value]="null" disabled>Select vendor</option>
                  <option *ngFor="let u of users" [value]="u.id">{{ u.name }}</option>
                </select>
              </div>
            </div>
            <div style="display:flex;gap:12px">
              <button class="btn btn-primary" (click)="save()">{{ editMode ? 'Update Product' : 'Save Product' }}</button>
              <button class="btn btn-outline" (click)="resetForm()">Cancel</button>
            </div>
          </div>

          <div class="data-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Price</th><th>Category</th><th>Stock</th>
                  <th>Reorder Level</th><th>Status</th><th>Vendor</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of products">
                  <td style="font-weight:600">{{ p.name }}</td>
                  <td>₹{{ p.price ?? '—' }}</td>
                  <td>{{ p.category }}</td>
                  <td [style.color]="p.currentStock <= p.reorderLevel ? '#ef4444' : '#22c55e'" style="font-weight:600">{{ p.currentStock }}</td>
                  <td>{{ p.reorderLevel }}</td>
                  <td><span [class]="p.stockStatus === 'OK' ? 'badge badge-ok' : 'badge badge-low'">{{ p.stockStatus }}</span></td>
                  <td>{{ p.vendorName }}</td>
                  <td>
                    <button class="btn btn-edit" (click)="edit(p)"><mat-icon style="font-size:16px">edit</mat-icon></button>
                    <button class="btn btn-danger" (click)="delete(p.id)"><mat-icon style="font-size:16px">delete</mat-icon></button>
                  </td>
                </tr>
                <tr *ngIf="products.length === 0">
                  <td colspan="8" style="text-align:center;color:#94a3b8;padding:32px">No products found. Add your first product!</td>
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
export class ProductsComponent implements OnInit {
  products: any[] = []; users: any[] = [];
  showForm = false; editMode = false; editId: number | null = null;
  form: any = { name: '', price: 0, category: '', currentStock: 0, reorderLevel: 0, vendorId: null };
  toast = '';

  constructor(private productService: ProductService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
    this.productService.getAllUsers().subscribe({ next: (d) => { this.users = d; this.cdr.detectChanges(); } });
  }

  load() {
    this.productService.getAllProducts().subscribe({ next: (d) => { this.products = d; this.cdr.detectChanges(); } });
  }

  showToast(msg: string) { this.toast = msg; setTimeout(() => this.toast = '', 3000); }

  save() {
    if (this.editMode && this.editId) {
      this.productService.updateProduct(this.editId, this.form).subscribe({
        next: () => { this.showToast('✅ Product updated!'); this.resetForm(); this.load(); },
        error: () => this.showToast('❌ Update failed!')
      });
    } else {
      this.productService.addProduct(this.form).subscribe({
        next: () => { this.showToast('✅ Product added!'); this.resetForm(); this.load(); },
        error: () => this.showToast('❌ Add failed!')
      });
    }
  }

  edit(p: any) {
    this.form = { name: p.name, price: p.price, category: p.category, currentStock: p.currentStock, reorderLevel: p.reorderLevel, vendorId: p.vendorId };
    this.editId = p.id; this.editMode = true; this.showForm = true;
  }

  delete(id: number) {
    this.productService.deleteProduct(id).subscribe({ next: () => { this.showToast('🗑️ Product deleted!'); this.load(); } });
  }

  resetForm() {
    this.form = { name: '', price: 0, category: '', currentStock: 0, reorderLevel: 0, vendorId: null };
    this.editMode = false; this.editId = null; this.showForm = false;
  }

  navigate(path: string) { this.router.navigate([path]); }
}
