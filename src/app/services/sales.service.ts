
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private base = `${environment.backendUrl}/sales`;

  getAll(): Observable<Sale[]> { return this.http.get<Sale[]>(this.base); }
  getById(id: string): Observable<Sale> { return this.http.get<Sale>(`${this.base}/${id}`); }
  create(body: Sale): Observable<Sale> { return this.http.post<Sale>(this.base, body); }
  update(id: string, body: Sale): Observable<Sale> { return this.http.put<Sale>(`${this.base}/${id}`, body); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
