import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ForecastService } from '../../services/forecast';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatIconModule, MatToolbarModule, MatTableModule, MatChipsModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="navigate('/dashboard')"><mat-icon>arrow_back</mat-icon></button>
      <span>Demand Forecast</span>
    </mat-toolbar>

    <div style="padding: 24px;">
      <h2>AI-Powered Inventory Forecast</h2>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <mat-card *ngFor="let f of forecasts" [style.border-left]="'4px solid ' + getRiskColor(f.riskLevel)">
          <mat-card-header>
            <mat-card-title>{{ f.productName }}</mat-card-title>
            <mat-card-subtitle>{{ f.category }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Current Stock: <strong>{{ f.currentStock }}</strong></p>
            <p>Predicted Demand: <strong>{{ f.predictedDemand | number:'1.0-0' }}</strong></p>
            <p>Days Until Stockout: <strong>{{ f.daysUntilStockout | number:'1.0-0' }}</strong></p>
            <p>Recommended Reorder: <strong>{{ f.recommendedReorderQuantity | number:'1.0-0' }}</strong></p>
            <mat-chip [style.background]="getRiskColor(f.riskLevel)" style="color: white;">
              {{ f.riskLevel }} RISK
            </mat-chip>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="forecasts.length === 0" style="text-align: center; margin-top: 48px;">
        <mat-icon style="font-size: 64px; color: #ccc;">trending_up</mat-icon>
        <p>No forecast data available. Add products and stock transactions first!</p>
      </div>
    </div>
  `
})
export class ForecastComponent implements OnInit {
  forecasts: any[] = [];

  constructor(private forecastService: ForecastService, private router: Router) {}

  ngOnInit() {
    this.forecastService.forecastAllProducts().subscribe({
      next: (data) => this.forecasts = data,
      error: () => this.forecasts = []
    });
  }

  getRiskColor(risk: string): string {
    if (risk === 'HIGH') return 'red';
    if (risk === 'MEDIUM') return 'orange';
    return 'green';
  }

  navigate(path: string) { this.router.navigate([path]); }
}
