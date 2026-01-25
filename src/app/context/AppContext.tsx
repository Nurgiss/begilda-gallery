import { createContext, useContext } from 'react';
import { CartItem, Currency, CurrencyRates } from '../../types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem['item'], type: 'painting' | 'shop') => void;
  updateQuantity: (itemId: string | number, type: 'painting' | 'shop', quantity: number) => void;
  removeFromCart: (itemId: string | number, type: 'painting' | 'shop') => void;
  clearCart: () => void;

  // Currency
  currency: Currency;
  rates: CurrencyRates;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number) => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AppContextType;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
