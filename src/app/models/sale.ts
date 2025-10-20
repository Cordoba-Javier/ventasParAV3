
export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id?: number;
  date: string;        // ISO yyyy-MM-dd
  customer: string;
  items: SaleItem[];
  total: number;
}
