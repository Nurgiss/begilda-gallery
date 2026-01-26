import { useState, useEffect } from 'react';
import { getPickupPoints, createPickupPoint, updatePickupPoint, deletePickupPoint } from '../../../api/client';
import type { PickupPoint } from '../../../types/models/PickupPoint';

export function PickupPointsManager() {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PickupPoint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    workingHours: '',
    isActive: true
  });

  useEffect(() => {
    loadPickupPoints();
  }, []);

  const loadPickupPoints = async () => {
    try {
      const data = await getPickupPoints();
      setPickupPoints(data);
    } catch (error) {
      console.error('Error loading pickup points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updatePickupPoint(String(editing.id), formData);
      } else {
        await createPickupPoint(formData);
      }
      await loadPickupPoints();
      resetForm();
    } catch (error) {
      console.error('Error saving pickup point:', error);
      alert('Ошибка при сохранении пункта самовывоза');
    }
  };

  const handleEdit = (pickupPoint: PickupPoint) => {
    setEditing(pickupPoint);
    setFormData({
      name: pickupPoint.name,
      address: pickupPoint.address,
      city: pickupPoint.city,
      phone: pickupPoint.phone,
      workingHours: pickupPoint.workingHours,
      isActive: pickupPoint.isActive
    });
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Вы уверены, что хотите удалить этот пункт самовывоза?')) {
      try {
        await deletePickupPoint(String(id));
        await loadPickupPoints();
      } catch (error) {
        console.error('Error deleting pickup point:', error);
        alert('Ошибка при удалении пункта самовывоза');
      }
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      phone: '',
      workingHours: '',
      isActive: true
    });
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
          <h1 className="admin-title">Управление пунктами самовывоза</h1>
        </div>

        <div className="admin-form-card">
          <h2 className="admin-form-title">{editing ? 'Редактировать ПВЗ' : 'Добавить новый ПВЗ'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Название *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Begilda Gallery"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">Город *</label>
              <input
                id="city"
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="Например, Алматы"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Адрес *</label>
              <input
                id="address"
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="Например, ул. Абая 123"
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
                placeholder="Например, +7 (777) 123-45-67"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="workingHours">Часы работы *</label>
              <input
                id="workingHours"
                type="text"
                className="form-input"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                required
                placeholder="Например, Пн-Пт 9:00-18:00"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Активен (виден клиентам)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn">
                {editing ? 'Обновить ПВЗ' : 'Добавить ПВЗ'}
              </button>
              {editing && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Город</th>
                <th>Адрес</th>
                <th>Телефон</th>
                <th>Часы работы</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {pickupPoints.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Пунктов самовывоза пока нет
                  </td>
                </tr>
              ) : (
                pickupPoints.map((point) => (
                  <tr key={point.id}>
                    <td style={{ fontWeight: 600 }}>{point.name}</td>
                    <td>{point.city}</td>
                    <td>{point.address}</td>
                    <td>{point.phone}</td>
                    <td>{point.workingHours}</td>
                    <td>
                      <span className={`admin-status ${point.isActive ? 'admin-status-completed' : 'admin-status-cancelled'}`}>
                        {point.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(point)}
                          className="admin-btn-edit"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDelete(point.id)}
                          className="admin-btn-delete"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
