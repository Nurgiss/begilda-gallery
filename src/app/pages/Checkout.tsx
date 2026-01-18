import { useState } from 'react';
import { createOrder } from '../../api/client';

interface ShopItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CheckoutProps {
  cart: Array<{item: any, type: 'painting' | 'shop', quantity: number}>;
  onNavigate: (page: string) => void;
  clearCart: () => void;
}

export function Checkout({ cart, onNavigate, clearCart }: CheckoutProps) {
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Формируем данные заказа
      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        items: cart.map(({ item, type, quantity }) => ({
          itemId: item.id,
          itemType: type,
          title: item.title,
          price: item.priceUSD || item.price,
          quantity
        })),
        totalAmount: cart.reduce((sum, { item, quantity }) => {
          const price = item.priceUSD || item.price || 0;
          return sum + (price * quantity);
        }, 0),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await createOrder(orderData);
      setLoading(false);
      setProcessing(true);

      // Показываем простой экран загрузки перед успехом
      setTimeout(() => {
        setProcessing(false);
        setSubmitted(true);
        clearCart();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
    } finally {
      // Дополнительный setLoading(false) на случай ошибки
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ maxWidth: '600px', padding: 'var(--spacing-xl) 0' }}>
          <h1 className="page-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>Заказ оформлен</h1>
          <p style={{ marginBottom: 'var(--spacing-lg)', color: '#666', maxWidth: '480px' }}>
            Спасибо за ваш заказ. Мы свяжемся с вами по указанным контактам:
          </p>
          <div style={{ marginBottom: 'var(--spacing-lg)', fontSize: '14px', lineHeight: 1.6 }}>
            {formData.firstName || formData.lastName ? (
              <div>{formData.lastName} {formData.firstName}</div>
            ) : null}
            {formData.email && <div>{formData.email}</div>}
            {formData.phone && <div>{formData.phone}</div>}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={() => onNavigate('home')}>
              На главную
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('catalog')}>
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (processing || loading) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
          <p style={{ marginBottom: 'var(--spacing-md)' }}>Оформляем ваш заказ…</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
        <p>Your cart is empty</p>
        <button className="btn" onClick={() => onNavigate('catalog')} style={{ marginTop: 'var(--spacing-md)' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '900px', padding: 'var(--spacing-xl) 0' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => onNavigate('catalog')}
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          Назад в каталог
        </button>
        <h1 className="page-title" style={{ marginBottom: 'var(--spacing-md)' }}>Оформление заказа</h1>
        
        {/* Сводка заказа */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '24px 32px', 
          marginBottom: 'var(--spacing-xl)'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 500 }}>Ваш заказ</h2>
          
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
                  <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>{cartItem.item.title}</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Количество: {cartItem.quantity}
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
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Итого</span>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>
              ${cart.reduce((sum, item) => {
                const price = item.item.priceUSD || item.item.price || 0;
                return sum + price * item.quantity;
              }, 0).toLocaleString('en-US')}
            </span>
          </div>
        </div>
        
        {/* Форма */}
        <form onSubmit={handleSubmit}>
          <h2 className="section-title" style={{ fontSize: '20px', marginBottom: 'var(--spacing-md)', textAlign: 'left' }}>Контактная информация</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="lastName">Фамилия *</label>
            <input
              id="lastName"
              type="text"
              className="form-input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="firstName">Имя *</label>
            <input
              id="firstName"
              type="text"
              className="form-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Телефон *</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ 
              width: '100%',
              marginTop: 'var(--spacing-md)',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Оформляем заказ…' : 'Оформить заказ'}
          </button>
        </form>
      </div>
    </div>
  );
}