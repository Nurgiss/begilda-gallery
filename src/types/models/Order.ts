export interface Order {
  id: string | number;
  fullName?: string;
  email: string;
  phone?: string;
  deliveryType?: 'pickup' | 'delivery';
  pickupPoint?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  items: Array<{
    itemId: number;
    itemType: 'painting' | 'shop';
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
