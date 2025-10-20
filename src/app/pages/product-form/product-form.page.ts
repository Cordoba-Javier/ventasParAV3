
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonItem, IonInput, IonLabel } from '@ionic/angular/standalone';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule,IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonItem, IonInput, IonLabel, ReactiveFormsModule],
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss']
})
export class ProductFormPage {
  private fb = inject(FormBuilder);
  private svc = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<string | null>(null);
  isEdit = computed(() => this.id() !== null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id.set(paramId);
      this.svc.getById(paramId).subscribe(p => this.form.patchValue(p));
    }
  }

  save() {
    const payload: Product = this.form.getRawValue();
    if (this.isEdit()) {
      this.svc.update(this.id()!, payload).subscribe(() => this.router.navigate(['/products']));
    } else {
      this.svc.create(payload).subscribe(() => this.router.navigate(['/products']));
    }
  }

  cancel() { this.router.navigate(['/products']); }
}
