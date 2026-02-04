import { useState, useEffect } from 'react';
import { getShopItems, createShopItem, updateShopItem, deleteShopItem, uploadImage } from '../../../api/client';
import type { ShopItem } from '../../../types/models/ShopItem';
import type { ShopItemFormData } from '../../../types/forms';

export function ShopManager() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<ShopItemFormData>({
    title: '',
    price: 0,
    image: '',
    category: 'Prints',
    description: ''
  });

  useEffect(() => {
    loadShopItems();
  }, []);

  const loadShopItems = async () => {
    try {
      const data = await getShopItems();
      setShopItems(data);
    } catch (error) {
      console.error('Error loading shop items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingItem(null);
    setFormData({
      title: '',
      price: 0,
      image: '',
      category: 'Prints',
      description: ''
    });
  };

  const handleEdit = (item: ShopItem) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteShopItem(id);
        await loadShopItems();
      } catch (error) {
        console.error('Error deleting shop item:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateShopItem(String(editingItem.id), formData);
      } else {
        await createShopItem(formData);
      }

      await loadShopItems();
      setIsEditing(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving shop item:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление магазином</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить товар
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        ) : isEditing ? (
          <div className="admin-form-container">
            <h2 className="admin-subtitle">
              {editingItem ? 'Редактировать товар' : 'Добавить новый товар'}
            </h2>

            <form onSubmit={handleSubmit} className="admin-form">
              {/* Основная информация */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Основная информация</h3>

                <div className="form-group">
                  <label className="form-label">Название товара *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите название"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Категория</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Prints">Принты</option>
                    <option value="Posters">Постеры</option>
                    <option value="Merchandise">Мерч</option>
                    <option value="Books">Книги</option>
                    <option value="Other">Другое</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Цена ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="99"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Изображение */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Изображение</h3>

                <div className="form-group">
                  <label className="form-label">Загрузить изображение *</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ padding: '0.75rem' }}
                  />
                  {uploadingImage && (
                    <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                      ⏳ Загрузка изображения...
                    </p>
                  )}
                  {formData.image && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Предпросмотр:</p>
                      <img
                        src={formData.image}
                        alt="Preview"
                        style={{
                          maxWidth: '300px',
                          maxHeight: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Описание */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Описание</h3>

                <div className="form-group">
                  <label className="form-label">Описание товара *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Опишите товар, его характеристики..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn">
                  {editingItem ? 'Сохранить' : 'Добавить'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        ) : (
            <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {shopItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="admin-table-image"
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>
                      <span className="admin-status admin-status-available">
                        {item.category}
                      </span>
                    </td>
                    <td>${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(item)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(String(item.id))}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
