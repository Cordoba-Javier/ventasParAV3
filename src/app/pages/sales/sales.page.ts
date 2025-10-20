
import { Component, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { SalesService } from '../../services/sales.service';
import { Sale } from '../../models/sale';
import { RouterLink } from '@angular/router';
import { addCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CurrencyPipe, CommonModule } from '@angular/common';
addIcons({ addCircle });

@Component({
  standalone: true,
  selector: 'app-sales',
  imports: [CommonModule, IonHeader, CurrencyPipe, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonNote, RouterLink],
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss']
})
export class SalesPage {
  private svc = inject(SalesService);
  sales = signal<Sale[]>([]);

  constructor() { this.load(); }

  load() { // TODO: Cargar las ventas desde el servicio}
  trackById = (_: number, s: Sale) => s.id!;
}
