export interface ShopItem {
  id: string | number;
  title: string;
  artist?: string;
  price: number;
  priceUSD?: number;
  priceEUR?: number;
  image: string;
  category: string;
  description: string;
}
