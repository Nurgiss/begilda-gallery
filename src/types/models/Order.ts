export interface Order {
  id: string | number;
  items: Array<{
    itemId: string | number;
    type: 'painting' | 'shop';
    quantity: number;
    unitPrice: number;
  }>;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt?: string;
}
