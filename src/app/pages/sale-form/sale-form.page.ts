
import { Component, inject, signal, computed } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonIcon } from '@ionic/angular/standalone';
import { SalesService } from '../../services/sales.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Sale, SaleItem } from '../../models/sale';
import { addCircle, removeCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CurrencyPipe, CommonModule } from '@angular/common';
addIcons({ addCircle, removeCircle });

@Component({
  standalone: true,
  selector: 'app-sale-form',
  imports: [ CommonModule, CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonInput, IonButton, IonSelect, IonSelectOption, ReactiveFormsModule, IonIcon
  ],
  templateUrl: './sale-form.page.html',
  styleUrls: ['./sale-form.page.scss']
})
export class SaleFormPage {
  private fb = inject(FormBuilder);
  private salesSvc = inject(SalesService);
  private productsSvc = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);

  form = this.fb.nonNullable.group({
    date: [new Date().toISOString().slice(0,10), Validators.required],
    customer: ['', Validators.required],
    items: this.fb.array([] as any[])
  });

  get items() { return this.form.get('items') as FormArray; }
total = signal(0);
  constructor() {
  this.productsSvc.getAll().subscribe(ps => this.products.set(ps));
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.salesSvc.getById(id).subscribe(s => {
      this.form.patchValue({ date: s.date, customer: s.customer });
      s.items.forEach(it => this.items.push(this.makeItemGroup(it)));
    });
  } else {
    this.addItem();

    this.productsSvc.getAll().subscribe(ps => {
      const firstProduct = ps[0];
      if (firstProduct) {
        this.items.at(0).patchValue({ productId: firstProduct.id });
        this.onProductChange(0);
      }
    });
  }

  // Subscribe to FormArray changes to trigger total recalculation
  this.items.valueChanges.subscribe(() => {
    const sum = this.items.controls.reduce((acc, g) => {
      const subtotal = Number(g.get('subtotal')?.value) || 0;
      return acc + subtotal;
    }, 0);
    this.total.set(sum);
  });
}

 makeItemGroup(it?: Partial<SaleItem>) {
  const group = this.fb.nonNullable.group({
    productId: [it?.productId ?? null, Validators.required],
    name: [it?.name ?? ''],
    quantity: [it?.quantity ?? 1, [Validators.required, Validators.min(1)]],
    unitPrice: [it?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
    subtotal: [it?.subtotal ?? 0]
  });
  // Subscribe to quantity and unitPrice changes
  group.get('quantity')!.valueChanges.subscribe(() => {
    const index = this.items.controls.indexOf(group);
    if (index !== -1) this.recalc(index);
  });
  group.get('unitPrice')!.valueChanges.subscribe(() => {
    const index = this.items.controls.indexOf(group);
    if (index !== -1) this.recalc(index);
  });
  return group;
}

  addItem() { this.items.push(this.makeItemGroup()); }
  removeItem(i: number) { this.items.removeAt(i); }
  trackByIndex = (_: number, __: any) => _;

  onProductChange(i: number) {
    const g = this.items.at(i);
    const pid = g.get('productId')!.value as string | null;
    const p = this.products().find(x => x.id === pid);
    if (p) {
      g.get('name')!.setValue(p.name);
      g.get('unitPrice')!.setValue(p.price);
      this.recalc(i);
    }
  }

  recalc(i: number) {
  const g = this.items.at(i);
  const q = +g.get('quantity')!.value || 0;
  const u = +g.get('unitPrice')!.value || 0;
  const subtotal = q * u;
  console.log(`Recalc item ${i}: quantity=${q}, unitPrice=${u}, subtotal=${subtotal}`);
  g.get('subtotal')!.setValue(subtotal, { emitEvent: false });
}

  save() {
    const raw = this.form.getRawValue();
    const payload: Sale = {
      date: raw.date!,
      customer: raw.customer!,
      items: (raw.items as any[]).map(g => ({
        productId: g.productId,
        name: g.name,
        quantity: g.quantity,
        unitPrice: g.unitPrice,
        subtotal: g.subtotal
      })),
      total: this.total()
    };

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.salesSvc.update(id, payload).subscribe(() => this.router.navigate(['/sales']));
    } else {
      this.salesSvc.create(payload).subscribe(() => this.router.navigate(['/sales']));
    }
  }

  cancel() { this.router.navigate(['/sales']); }
}
