
import { Component, inject, signal, computed } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonSearchbar, IonRefresher, IonRefresherContent, IonToast, IonSkeletonText } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { addCircle, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CurrencyPipe, CommonModule } from '@angular/common';

addIcons({ addCircle, trash });

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [ CommonModule, CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton,
    RouterLink, IonSearchbar, IonRefresher, IonRefresherContent, IonToast
  ],
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss']
})
export class ProductsPage {
  private svc = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  q = signal('');
  toastOpen = signal(false);
  toastMsg = signal('');

  constructor() { this.load(); }

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.products().filter(p => !term || p.name.toLowerCase().includes(term));
  });

  trackById = (_: number, p: Product) => p.id!;

  onSearch(ev: any) { this.q.set(ev.target.value ?? ''); }

  load() { this.svc.getAll().subscribe(list => this.products.set(list)); }

  reload(ev: CustomEvent) {
    this.load();
    setTimeout(() => (ev.target as any).complete(), 600);
  }

  remove(p: Product, ev: Event) {
    ev.preventDefault(); ev.stopPropagation();
    if (!p.id) return;
    this.svc.delete(p.id).subscribe(() => {
      this.toastMsg.set('Producto eliminado');
      this.toastOpen.set(true);
      this.load();
    });
  }
}
