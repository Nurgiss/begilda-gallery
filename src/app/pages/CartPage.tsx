import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useAppContext();

  const cartTotal = cart
    .filter((item) => item && item.item)
    .reduce((sum, item) => {
      const price = item.item.priceUSD || item.item.price || 0;
      return sum + price * item.quantity;
    }, 0);

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
      <h1 className="page-title">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart
              .filter((cartItem) => cartItem && cartItem.item)
              .map((cartItem) => (
                <div key={`${cartItem.item.id}-${cartItem.type}`} className="cart-item">
                  <img
                    src={cartItem.item.image || cartItem.item.imageUrl}
                    alt={cartItem.item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{cartItem.item.title}</h3>
                    {cartItem.item.artist && (
                      <p className="cart-item-artist">{cartItem.item.artist}</p>
                    )}
                    <p className="cart-item-price">
                      ${(cartItem.item.priceUSD || cartItem.item.price || 0).toLocaleString('en-US')}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity-display">{cartItem.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(cartItem.item.id, cartItem.type, cartItem.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(cartItem.item.id, cartItem.type)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toLocaleString('en-US')}</span>
          </div>
          <div className="cart-actions">
            <Link to="/shop" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
