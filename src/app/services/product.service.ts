
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.backendUrl}/products`;

  getAll(): Observable<Product[]> {
    //TODO: Implementar método para obtener todos los productos
    return this.http.get<Product[]>(this.base);
    }
  getById(id: string): Observable<Product> {
    //TODO: Implementar método para obtener un producto por ID
    return this.http.get<Product>(`${this.base}/${id}`);
  }
  create(body: Product): Observable<Product> {
     //TODO: Implementar método para crear un nuevo producto
     return this.http.post<Product>(this.base, body);
    }
  update(id: string, body: Product): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, body);
  }
  delete(id: string): Observable<void> {
    //TODO: Implementar método para eliminar un producto por ID
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
