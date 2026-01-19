import { useState, useEffect } from 'react';
import { createOrder, getPickupPoints } from '../../api/client';

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  workingHours: string;
  isActive: boolean;
}

interface CheckoutProps {
  cart: Array<{ item: any; type: 'painting' | 'shop'; quantity: number }>;
  onNavigate: (page: string) => void;
  clearCart: () => void;
}

const COUNTRIES_CITIES: Record<string, string[]> = {
  'Kazakhstan': ['Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe', 'Taraz', 'Pavlodar', 'Ust-Kamenogorsk', 'Semey', 'Atyrau', 'Kostanay', 'Kyzylorda', 'Uralsk', 'Petropavlovsk', 'Aktau', 'Temirtau', 'Turkestan', 'Other'],
  'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd', 'Other'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Miami', 'Other'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Glasgow', 'Cardiff', 'Belfast', 'Other'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Other'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Other'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Other'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Other'],
  'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Chongqing', 'Wuhan', 'Chengdu', 'Nanjing', 'Xi\'an', 'Hangzhou', 'Qingdao', 'Dalian', 'Other'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Hiroshima', 'Other'],
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Other'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Other'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Other'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin', 'Other'],
  'Other': ['Other']
};

const COUNTRIES = Object.keys(COUNTRIES_CITIES);

export function Checkout({ cart, onNavigate, clearCart }: CheckoutProps) {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryType: 'delivery' as 'pickup' | 'delivery',
    pickupPoint: '',
    country: '',
    postalCode: '',
    city: '',
    address: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    loadPickupPoints();
  }, []);

  const loadPickupPoints = async () => {
    try {
      const data = await getPickupPoints();
      setPickupPoints(data.filter((p: PickupPoint) => p.isActive));
    } catch (error) {
      console.error('Error loading pickup points:', error);
    }
  };
  
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    // Ограничиваем 15 цифрами
    const limited = numbers.slice(0, 15);
    // Форматируем: +X (XXX) XXX-XX-XX
    if (limited.length === 0) return '';
    if (limited.length <= 1) return `+${limited}`;
    if (limited.length <= 4) return `+${limited.slice(0, 1)} (${limited.slice(1)}`;
    if (limited.length <= 7) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4)}`;
    if (limited.length <= 9) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
    return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9)}`;
  };
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10;
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Пожалуйста, введите полное имя';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Номер телефона должен содержать минимум 10 цифр';
    }
    
    if (formData.deliveryType === 'pickup' && !formData.pickupPoint) {
      newErrors.pickupPoint = 'Пожалуйста, выберите пункт самовывоза';
    }
    
    if (formData.deliveryType === 'delivery') {
      if (!formData.country) newErrors.country = 'Выберите страну';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Введите почтовый индекс';
      if (!formData.city) newErrors.city = 'Выберите город';
      if (!formData.address.trim()) newErrors.address = 'Введите адрес';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const totalAmount = cart.reduce((sum, { item, quantity }) => {
        const price = item.priceUSD || item.price || 0;
        return sum + price * quantity;
      }, 0);

      const hasShopItems = cart.some(({ type }) => type === 'shop');

      // Minimum order requirement: Shop items delivery only from $100
      if (formData.deliveryType === 'delivery' && hasShopItems && totalAmount < 100) {
        alert('Minimum order amount for Shop items delivery is $100.');
        setLoading(false);
        return;
      }

      // Формируем данные заказа
      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        deliveryType: formData.deliveryType,
        pickupPoint: formData.deliveryType === 'pickup' ? formData.pickupPoint : undefined,
        country: formData.deliveryType === 'delivery' ? formData.country : undefined,
        postalCode: formData.deliveryType === 'delivery' ? formData.postalCode : undefined,
        city: formData.deliveryType === 'delivery' ? formData.city : undefined,
        address: formData.deliveryType === 'delivery' ? formData.address : undefined,
        items: cart.map(({ item, type, quantity }) => ({
          itemId: item.id,
          itemType: type,
          title: item.title,
          price: item.priceUSD || item.price,
          quantity
        })),
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const created = await createOrder(orderData);
      setOrderId(created?.id || null);
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
      alert('Error placing order. Please try again.');
    } finally {
      // Дополнительный setLoading(false) на случай ошибки
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ maxWidth: '600px', padding: 'var(--spacing-xl) 0' }}>
          <h1 className="page-title" style={{ textAlign: 'left', marginBottom: 'var(--spacing-md)' }}>Order Placed</h1>
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
            <p style={{ margin: 0 }}>Email: info@begilda.gallery</p>
            <p style={{ margin: 0 }}>Phone: +7 (000) 000-00-00</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('catalog')}>
              Continue Shopping
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
          <p style={{ marginBottom: 'var(--spacing-md)' }}>Processing your order…</p>
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

  const totalAmount = cart.reduce((sum, { item, quantity }) => {
    const price = item.priceUSD || item.price || 0;
    return sum + price * quantity;
  }, 0);

  const hasShopItems = cart.some(({ type }) => type === 'shop');
  const isDelivery = formData.deliveryType === 'delivery';
  const minAmount = 100;
  const needsMinimum = hasShopItems && isDelivery;
  const meetsMinimum = !needsMinimum || totalAmount >= minAmount;
  const progressPercent = needsMinimum ? Math.min((totalAmount / minAmount) * 100, 100) : 100;

  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: '900px', padding: 'var(--spacing-xl) 0' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => onNavigate('cart')}
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          Back to Cart
        </button>
        <h1 className="page-title" style={{ marginBottom: 'var(--spacing-md)' }}>Checkout</h1>
        
        {/* Сводка заказа */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '24px 32px', 
          marginBottom: 'var(--spacing-xl)'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#333', fontWeight: 500 }}>Your Order</h2>
          
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
              ${cart.reduce((sum, item) => {
                const price = item.item.priceUSD || item.item.price || 0;
                return sum + price * item.quantity;
              }, 0).toLocaleString('en-US')}
            </span>
          </div>
        </div>
        
        {/* Информация о доставке */}
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '20px 28px', 
          marginBottom: 'var(--spacing-xl)',
          borderRadius: '8px',
          borderLeft: '4px solid #2196f3'
        }}>
          <h2 style={{ 
            fontSize: '16px', 
            marginBottom: '12px', 
            color: '#1565c0', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🚚</span> Shipping Information
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976d2', lineHeight: '1.6' }}>
            The amount shown above excludes shipping cost. Shipping will be calculated individually after order placement based on your location and delivery method.
          </p>
        </div>
        
        {/* Прогресс-бар минимальной суммы для доставки Shop */}
        {needsMinimum && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '16px 24px', 
            marginBottom: 'var(--spacing-xl)',
            borderLeft: '4px solid #ffc107'
          }}>
            <p style={{ margin: 0, marginBottom: '12px', fontSize: '14px', color: '#856404', fontWeight: 500 }}>
              Minimum amount for Shop items delivery: $100
            </p>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                backgroundColor: meetsMinimum ? '#28a745' : '#ffc107',
                transition: 'width 0.3s ease, background-color 0.3s ease'
              }} />
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
              {meetsMinimum 
                ? '✓ Minimum reached' 
                : `$${(minAmount - totalAmount).toFixed(2)} more to minimum`}
            </p>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="section-title" style={{ fontSize: '20px', marginBottom: 'var(--spacing-md)', textAlign: 'left' }}>Contact Information</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: '' });
                }
              }}
              required
              style={{ borderColor: errors.fullName ? '#dc3545' : undefined }}
            />
            {errors.fullName && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              required
              style={{ borderColor: errors.email ? '#dc3545' : undefined }}
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone *</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setFormData({ ...formData, phone: formatted });
                if (errors.phone) {
                  setErrors({ ...errors, phone: '' });
                }
              }}
              placeholder="+1 (234) 567-89-01"
              required
              style={{ borderColor: errors.phone ? '#dc3545' : undefined }}
            />
            {errors.phone && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.phone}
              </p>
            )}
          </div>

          <h2 className="section-title" style={{ fontSize: '20px', margin: 'var(--spacing-lg) 0 var(--spacing-md)', textAlign: 'left' }}>
            Delivery Method and Address
          </h2>

          <div className="form-group">
            <label className="form-label">Delivery Type *</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-option ${formData.deliveryType === 'pickup' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
              >
                Pickup
              </button>
              <button
                type="button"
                className={`segmented-option ${formData.deliveryType === 'delivery' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, deliveryType: 'delivery' })}
              >
                Delivery
              </button>
            </div>
          </div>

          {formData.deliveryType === 'pickup' ? (
            <div className="form-group">
              <label className="form-label">Pickup Point *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pickupPoints.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>No pickup points available</p>
                ) : (
                  pickupPoints.map((point) => (
                    <label
                      key={point.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        border: formData.pickupPoint === point.id ? '2px solid #000' : '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: formData.pickupPoint === point.id ? '#f8f9fa' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="radio"
                        name="pickupPoint"
                        value={point.id}
                        checked={formData.pickupPoint === point.id}
                        onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                        required={formData.deliveryType === 'pickup'}
                        style={{ marginTop: '4px', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{point.name}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                          {point.city}, {point.address}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                          📞 {point.phone}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          🕐 {point.workingHours}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="country">Country *</label>
                <select
                  id="country"
                  className="form-select"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value, city: '' })}
                  required={formData.deliveryType === 'delivery'}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="postalCode">Postal Code *</label>
                <input
                  id="postalCode"
                  type="text"
                  className="form-input"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required={formData.deliveryType === 'delivery'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">City *</label>
                <select
                  id="city"
                  className="form-select"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required={formData.deliveryType === 'delivery'}
                  disabled={!formData.country}
                >
                  <option value="">Select city</option>
                  {formData.country && COUNTRIES_CITIES[formData.country]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">Address *</label>
                <input
                  id="address"
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required={formData.deliveryType === 'delivery'}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn" 
            disabled={loading || !meetsMinimum}
            style={{ 
              width: '100%',
              marginTop: 'var(--spacing-md)',
              opacity: (loading || !meetsMinimum) ? 0.6 : 1,
              cursor: (loading || !meetsMinimum) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing order…' : !meetsMinimum ? `Minimum $${minAmount} for delivery` : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}