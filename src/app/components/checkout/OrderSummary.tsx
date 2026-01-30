import type { CartItem } from '@/types/models/Cart';

interface OrderSummaryProps {
  cart: CartItem[];
  totalAmount: number;
}

export function OrderSummary({ cart, totalAmount }: OrderSummaryProps) {
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '24px 32px',
      marginBottom: 'var(--spacing-xl)'
    }}>
      <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 500 }}>
        Your Order
      </h2>

      {cart.map((cartItem, index) => {
        const price = cartItem.item.priceUSD || cartItem.item.price || 0;
        return (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: index < cart.length - 1 ? '1px solid #e0e0e0' : 'none'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                {cartItem.item.title}
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>
                Quantity: {cartItem.quantity}
              </p>
            </div>
            <p style={{ margin: 0, fontWeight: '600', color: '#333', fontSize: '1.1rem' }}>
              ${(price * cartItem.quantity).toLocaleString('en-US')}
            </p>
          </div>
        );
      })}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #333'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>Total</span>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>
          ${totalAmount.toLocaleString('en-US')}
        </span>
      </div>
    </div>
  );
}
