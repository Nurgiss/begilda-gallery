import { useState, useEffect } from 'react';
import { getOrders, updateOrder, deleteOrder } from '../../../api/client';

interface Order {
  id: string;
  fullName?: string;
  email: string;
  phone?: string;
  deliveryType?: 'pickup' | 'delivery';
  pickupPoint?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  items: Array<{
    itemId: number;
    itemType: 'painting' | 'shop';
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      
      await updateOrder(orderId, { ...order, status: newStatus });
      await loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Ошибка при обновлении заказа');
    }
  };
  
  const handleDelete = async (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        await deleteOrder(orderId);
        await loadOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Ошибка при удалении заказа');
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'admin-status-new';
      case 'processing': return 'admin-status-processing';
      case 'completed': return 'admin-status-completed';
      case 'cancelled': return 'admin-status-cancelled';
      default: return '';
    }
  };
  
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'В обработке';
      case 'completed': return 'Завершён';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление заказами</h1>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#667eea' }}>
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
              🆕 Новых заказов
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f5576c' }}>
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
              ⚙️ В обработке
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#4facfe' }}>
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
              ✅ Завершено
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#43e97b' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
              📊 Всего заказов
            </div>
          </div>
        </div>
        
        <div className="orders-container">
          <div className="orders-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Order Number</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Товаров</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      Заказов пока нет
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr 
                      key={order.id}
                      className={selectedOrder?.id === order.id ? 'admin-table-row-selected' : ''}
                      onClick={() => setSelectedOrder(order)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>#{index + 1}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#666' }}>{order.id}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {order.fullName && <div style={{ fontWeight: '600' }}>{order.fullName}</div>}
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>{order.email}</div>
                          {order.phone && <div style={{ fontSize: '0.875rem', color: '#666' }}>{order.phone}</div>}
                        </div>
                      </td>
                      <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td>${order.totalAmount.toLocaleString('en-US')}</td>
                      <td>
                        <span className={`admin-status ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="form-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="processing">В обработке</option>
                          <option value="completed">Завершён</option>
                          <option value="cancelled">Отменён</option>
                        </select>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          className="admin-btn-delete"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {selectedOrder && (
            <div className="order-details" style={{ 
              marginTop: '2rem', 
              padding: '2rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              border: '1px solid #dee2e6'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
                Детали заказа #{orders.findIndex(o => o.id === selectedOrder.id) + 1}
                <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                  Order Number: {selectedOrder.id}
                </div>
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#555' }}>
                  📧 Контактная информация
                </h3>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  {selectedOrder.fullName && (
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>ФИО:</strong> {selectedOrder.fullName}
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Email:</strong> <a href={`mailto:${selectedOrder.email}`}>{selectedOrder.email}</a>
                  </p>
                  {selectedOrder.phone && (
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Телефон:</strong> <a href={`tel:${selectedOrder.phone}`}>{selectedOrder.phone}</a>
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0' }}>
                    <strong>Дата заказа:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              
              {selectedOrder.deliveryType && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#555' }}>
                    🚚 Информация о доставке
                  </h3>
                  <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ margin: '0.5rem 0' }}>
                      <strong>Тип:</strong> {selectedOrder.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
                    </p>
                    {selectedOrder.deliveryType === 'pickup' && selectedOrder.pickupPoint && (
                      <p style={{ margin: '0.5rem 0' }}>
                        <strong>Пункт самовывоза:</strong> {selectedOrder.pickupPoint}
                      </p>
                    )}
                    {selectedOrder.deliveryType === 'delivery' && (
                      <>
                        {selectedOrder.country && (
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>Страна:</strong> {selectedOrder.country}
                          </p>
                        )}
                        {selectedOrder.city && (
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>Город:</strong> {selectedOrder.city}
                          </p>
                        )}
                        {selectedOrder.postalCode && (
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>Индекс:</strong> {selectedOrder.postalCode}
                          </p>
                        )}
                        {selectedOrder.address && (
                          <p style={{ margin: '0.5rem 0' }}>
                            <strong>Адрес:</strong> {selectedOrder.address}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#555' }}>
                  🛍️ Товары в заказе
                </h3>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      padding: '0.75rem 0', 
                      borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600' }}>{item.title}</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>
                          Количество: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>
                        ${(item.price * item.quantity).toLocaleString('en-US')}
                      </p>
                    </div>
                  ))}
                  <div style={{ 
                    marginTop: '1rem', 
                    paddingTop: '1rem', 
                    borderTop: '2px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: '700'
                  }}>
                    <span>Итого:</span>
                    <span style={{ color: '#2e7d32' }}>${selectedOrder.totalAmount.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#555' }}>
                  📊 Статус заказа
                </h3>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <span className={`admin-status ${getStatusColor(selectedOrder.status)}`} style={{ fontSize: '1rem' }}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
                style={{ width: '100%' }}
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
