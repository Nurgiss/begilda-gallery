import { Link } from 'react-router-dom';

export function EmptyCart() {
  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
      <p>Your cart is empty</p>
      <Link to="/catalog" className="btn" style={{ marginTop: 'var(--spacing-md)' }}>
        Back to Catalog
      </Link>
    </div>
  );
}
