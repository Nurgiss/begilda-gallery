import { useState, useEffect } from 'react';
import { getExhibitions, createExhibition, updateExhibition, deleteExhibition, getPaintings } from '../../../api/client';

export function ExhibitionsManager() {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    location: '',
    dates: '',
    description: '',
    image: '',
    status: 'upcoming',
    paintingIds: []
  });

  useEffect(() => {
    loadExhibitions();
    loadPaintings();
  }, []);

  const loadExhibitions = async () => {
    try {
      const data = await getExhibitions();
      setExhibitions(data);
    } catch (error) {
      console.error('Error loading exhibitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaintings = async () => {
    try {
      const data = await getPaintings();
      setPaintings(data);
    } catch (error) {
      console.error('Error loading paintings:', error);
    }
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingExhibition(null);
    setFormData({
      title: '',
      location: '',
      dates: '',
      description: '',
      image: '',
      status: 'upcoming',
      paintingIds: []
    });
  };

  const handleEdit = (exhibition: any) => {
    setIsEditing(true);
    setEditingExhibition(exhibition);
    setFormData(exhibition);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту выставку?')) {
      try {
        await deleteExhibition(id);
        await loadExhibitions();
      } catch (error) {
        console.error('Error deleting exhibition:', error);
        alert('Ошибка при удалении выставки');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev: any) => ({ ...prev, image: data.url }));
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
      if (editingExhibition) {
        await updateExhibition(editingExhibition.id, formData);
      } else {
        await createExhibition(formData);
      }

      await loadExhibitions();
      setIsEditing(false);
      setEditingExhibition(null);
    } catch (error) {
      console.error('Error saving exhibition:', error);
      alert('Ошибка при сохранении выставки');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingExhibition(null);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление выставками</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить выставку
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        ) : isEditing ? (
          <div className="admin-form-container">
            <h2 className="admin-subtitle">
              {editingExhibition ? 'Редактировать выставку' : 'Добавить новую выставку'}
            </h2>

            <form onSubmit={handleSubmit} className="admin-form">
              {/* Основная информация */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Основная информация</h3>

                <div className="form-group">
                  <label className="form-label">Название выставки *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите название"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Локация *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Begilda Gallery, Almaty"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Даты проведения *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="15 марта - 30 апреля 2026"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Статус *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="upcoming">Предстоящая</option>
                      <option value="current">Текущая</option>
                      <option value="past">Прошедшая</option>
                    </select>
                  </div>
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
                  <label className="form-label">Описание выставки *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Опишите выставку, ее концепцию и особенности..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={5}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Картины в выставке */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Картины в выставке</h3>
                
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {paintings.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Нет доступных картин. Сначала добавьте картины в каталог.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {paintings.map(painting => {
                        const isSelected = formData.paintingIds?.includes(painting.id);
                        const imageUrl = painting.imageUrl || painting.image;
                        const displayImage = imageUrl?.startsWith('/uploads/') 
                          ? `http://localhost:3001${imageUrl}` 
                          : imageUrl;

                        return (
                          <label 
                            key={painting.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              padding: '0.75rem',
                              backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                              border: `2px solid ${isSelected ? '#2196f3' : '#dee2e6'}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const newIds = e.target.checked
                                  ? [...(formData.paintingIds || []), painting.id]
                                  : (formData.paintingIds || []).filter((id: string) => id !== painting.id);
                                setFormData({ ...formData, paintingIds: newIds });
                              }}
                              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            {displayImage && (
                              <img 
                                src={displayImage}
                                alt={painting.title}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6'
                                }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                {painting.title}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                {painting.artist || 'Неизвестный артист'} • {painting.year}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {formData.paintingIds?.length > 0 && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      backgroundColor: '#d4edda', 
                      borderRadius: '6px',
                      color: '#155724',
                      fontSize: '0.9rem'
                    }}>
                      ✓ Выбрано картин: {formData.paintingIds.length}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn">
                  {editingExhibition ? 'Сохранить' : 'Добавить'}
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
                  <th>Локация</th>
                  <th>Даты</th>
                  <th>Картины</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map(exhibition => (
                  <tr key={exhibition.id}>
                    <td>
                      <img
                        src={exhibition.image || exhibition.imageUrl}
                        alt={exhibition.title}
                        className="admin-table-image"
                      />
                    </td>
                    <td>{exhibition.title}</td>
                    <td>{exhibition.location}</td>
                    <td>{exhibition.dates}</td>
                    <td style={{ textAlign: 'center' }}>
                      {exhibition.paintingIds?.length || 0} шт.
                    </td>
                    <td>
                      <span className={`admin-status ${
                        exhibition.status === 'current' ? 'admin-status-available' :
                        exhibition.status === 'upcoming' ? 'admin-status-upcoming' :
                        'admin-status-sold'
                      }`}>
                        {exhibition.status === 'current' && 'Текущая'}
                        {exhibition.status === 'upcoming' && 'Предстоящая'}
                        {exhibition.status === 'past' && 'Прошедшая'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(exhibition)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(exhibition.id)}
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
