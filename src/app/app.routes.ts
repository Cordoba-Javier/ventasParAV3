import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPage)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./pages/product-form/product-form.page').then(m => m.ProductFormPage)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-form/product-form.page').then(m => m.ProductFormPage)
  },
  {
    path: 'sales',
    loadComponent: () => import('./pages/sales/sales.page').then(m => m.SalesPage)
  },
  {
    path: 'sales/new',
    loadComponent: () => import('./pages/sale-form/sale-form.page').then(m => m.SaleFormPage)
  },
  {
    path: 'sales/:id',
    loadComponent: () => import('./pages/sale-form/sale-form.page').then(m => m.SaleFormPage)
  },
  { path: '**', redirectTo: 'alumno' },
  {
    path: 'alumno',
    loadComponent: () => import('./pages/alumno/alumno.page').then( m => m.AlumnoPage)
  }

];
