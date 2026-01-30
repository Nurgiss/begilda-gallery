import type { DeliveryType } from '../common/DeliveryType';
import type { OrderStatus } from '../common/OrderStatus';
import type { CartItemType } from './Cart';

export interface OrderItem {
  itemId: number;
  itemType: CartItemType;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string | number;
  fullName?: string;
  email: string;
  phone?: string;
  deliveryType?: DeliveryType;
  pickupPoint?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
