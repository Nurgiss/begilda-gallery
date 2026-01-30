import { Link } from 'react-router-dom';
import { GALLERY_CONTACT } from '@/constants/checkout';
import type { CheckoutFormData } from '@/types/forms';

interface OrderSuccessProps {
  orderId: string | null;
  formData: CheckoutFormData;
}

export function OrderSuccess({ orderId, formData }: OrderSuccessProps) {
  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '600px', padding: 'var(--spacing-xl) 0' }}>
        <h1 className="page-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>
          Order Placed
        </h1>
        <p style={{ marginBottom: 'var(--spacing-sm)', color: '#666', maxWidth: '480px' }}>
          Thank you for your order.
        </p>
        {orderId && (
          <p style={{ marginBottom: 'var(--spacing-md)', fontWeight: 500 }}>
            Your order number: <span style={{ fontFamily: 'monospace' }}>{orderId}</span>
          </p>
        )}
        <p style={{ marginBottom: 'var(--spacing-md)', color: '#666', maxWidth: '480px' }}>
          We will contact you at the provided details:
        </p>
        <div style={{ marginBottom: 'var(--spacing-lg)', fontSize: '14px', lineHeight: 1.6 }}>
          {formData.fullName && <div>{formData.fullName}</div>}
          {formData.email && <div>{formData.email}</div>}
          {formData.phone && <div>{formData.phone}</div>}
        </div>
        <div style={{ marginBottom: 'var(--spacing-lg)', fontSize: '14px', lineHeight: 1.6 }}>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>Our contacts:</p>
          <p style={{ margin: 0 }}>Email: {GALLERY_CONTACT.email}</p>
          <p style={{ margin: 0 }}>Phone: {GALLERY_CONTACT.phone}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" className="btn">Back to Home</Link>
          <Link to="/catalog" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
