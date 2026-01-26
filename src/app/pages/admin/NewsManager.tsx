import { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews, uploadImage } from '../../../api/client';
import type { News } from '../../../types/models/News';
import type { NewsFormData } from '../../../types/forms';

export function NewsManager() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Выставки',
    instagramUrl: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getNews();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Выставки',
      instagramUrl: ''
    });
  };

  const handleEdit = (newsItem: News) => {
    setIsEditing(true);
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image,
      date: newsItem.date,
      category: newsItem.category,
      instagramUrl: newsItem.instagramUrl || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      try {
        await deleteNews(id);
        await loadNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Ошибка при удалении новости');
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
      if (editingNews) {
        await updateNews(String(editingNews.id), formData);
      } else {
        await createNews(formData);
      }

      await loadNews();
      setIsEditing(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка при сохранении новости');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNews(null);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление новостями</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить новость
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        ) : isEditing ? (
          <div className="admin-form-container">
            <h2 className="admin-subtitle">
              {editingNews ? 'Редактировать новость' : 'Добавить новую новость'}
            </h2>

            <form onSubmit={handleSubmit} className="admin-form">
              {/* Основная информация */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Основная информация</h3>

                <div className="form-group">
                  <label className="form-label">Заголовок *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите заголовок новости"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Категория *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="Выставки">Выставки</option>
                      <option value="События">События</option>
                      <option value="Новые работы">Новые работы</option>
                      <option value="Анонсы">Анонсы</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Дата *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Краткое описание *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Краткое описание новости (1-2 предложения)"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={3}
                    style={{ resize: 'vertical' }}
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

              {/* Полный текст */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Полный текст</h3>

                <div className="form-group">
                  <label className="form-label">Содержание новости *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Полный текст новости..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn">
                  {editingNews ? 'Сохранить' : 'Добавить'}
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
                  <th>Заголовок</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {news.map(newsItem => (
                  <tr key={newsItem.id}>
                    <td>
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="admin-table-image"
                      />
                    </td>
                    <td>{newsItem.title}</td>
                    <td>
                      <span className="admin-status admin-status-available">
                        {newsItem.category}
                      </span>
                    </td>
                    <td>{new Date(newsItem.date).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(newsItem)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(String(newsItem.id))}
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
