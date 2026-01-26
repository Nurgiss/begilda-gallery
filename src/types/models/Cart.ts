import type { Painting } from './Painting';
import type { ShopItem } from './ShopItem';

export type CartItemType = 'painting' | 'shop';

export interface PaintingCartItem {
  item: Painting;
  type: 'painting';
  quantity: number;
}

export interface ShopCartItem {
  item: ShopItem;
  type: 'shop';
  quantity: number;
}

export type CartItem = PaintingCartItem | ShopCartItem;

export type Cart = CartItem[];
