import { useState } from 'react';

interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface AdminNewsProps {
  news: News[];
  onAddNews: (news: Omit<News, 'id'>) => void;
  onEditNews: (news: News) => void;
  onDeleteNews: (id: number) => void;
}

export function AdminNews({ news, onAddNews, onEditNews, onDeleteNews }: AdminNewsProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Выставка'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNews) {
      onEditNews({ ...formData, id: editingNews.id });
    } else {
      onAddNews(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Выставка'
    });
    setEditingNews(null);
    setShowModal(false);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image,
      date: newsItem.date,
      category: newsItem.category
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      onDeleteNews(id);
    }
  };

  return (
    <div className="admin-section">
      <div className="container">
        <div className="admin-header-row">
          <h1 className="section-title">Управление новостями</h1>
          <button className="btn" onClick={() => setShowModal(true)}>
            + Добавить новость
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Дата</th>
              <th>Краткое описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id}>
                <td>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="admin-painting-image"
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td>{item.excerpt.substring(0, 50)}...</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      className="action-btn action-btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className="action-btn action-btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                </h2>
                <button className="modal-close" onClick={resetForm}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Название</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Категория</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="Выставка">Выставка</option>
                    <option value="Событие">Событие</option>
                    <option value="Мастер-класс">Мастер-класс</option>
                    <option value="Анонс">Анонс</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Дата</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL изображения</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Краткое описание</label>
                  <textarea
                    className="form-textarea"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Полное содержание</label>
                  <textarea
                    className="form-textarea"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Отмена
                  </button>
                  <button type="submit" className="btn">
                    {editingNews ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
