export interface CartItem {
  item: any; // Painting or ShopItem
  type: 'painting' | 'shop';
  quantity: number;
}

export interface Cart extends Array<CartItem> {}
