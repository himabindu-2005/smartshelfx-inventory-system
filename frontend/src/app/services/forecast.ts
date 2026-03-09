import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private apiUrl = 'http://localhost:8080/api/forecast';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  forecastAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  forecastProduct(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/${productId}`,
      { headers: this.getHeaders() });
  }

  getHighRiskProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/high-risk`, { headers: this.getHeaders() });
  }
}
