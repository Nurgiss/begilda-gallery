import { useState, useEffect } from 'react';
import { getArtists, createArtist, updateArtist, deleteArtist } from '../../../api/client';

export function ArtistsManager() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtist, setEditingArtist] = useState<any | null>(null);

  const [formData, setFormData] = useState<any>({
    name: '',
    bio: '',
    image: '',
    nationality: '',
    born: '',
    specialty: ''
  });

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditing(true);
    setEditingArtist(null);
    setFormData({
      name: '',
      bio: '',
      image: '',
      nationality: '',
      born: '',
      specialty: ''
    });
  };

  const handleEdit = (artist: any) => {
    setIsEditing(true);
    setEditingArtist(artist);
    setFormData(artist);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого артиста?')) {
      try {
        await deleteArtist(id);
        await loadArtists();
      } catch (error) {
        console.error('Error deleting artist:', error);
        alert('Ошибка при удалении артиста');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingArtist) {
        await updateArtist(editingArtist.id, formData);
      } else {
        await createArtist(formData);
      }

      await loadArtists();
      setIsEditing(false);
      setEditingArtist(null);
      setFormData({
        name: '',
        bio: '',
        image: '',
        nationality: '',
        born: '',
        specialty: ''
      });
    } catch (error) {
      console.error('Error saving artist:', error);
      alert('Ошибка при сохранении артиста');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArtist(null);
    setFormData({
      name: '',
      bio: '',
      image: '',
      nationality: '',
      born: '',
      specialty: ''
    });
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление артистами</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить артиста
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        ) : isEditing ? (
          <div className="admin-form-container">
            <h2 className="admin-subtitle">
              {editingArtist ? 'Редактировать артиста' : 'Добавить нового артиста'}
            </h2>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Имя артиста *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Введите имя"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Биография *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Расскажите об артисте..."
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows={5}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL изображения *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
                {formData.image && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Предпросмотр:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Национальность *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Казахстан"
                    value={formData.nationality || ''}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Год рождения *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1985"
                    value={formData.born || ''}
                    onChange={(e) => setFormData({ ...formData, born: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Специализация *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Масляная живопись, абстракция"
                  value={formData.specialty || ''}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn">
                  {editingArtist ? 'Сохранить' : 'Добавить'}
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
                  <th>Фото</th>
                  <th>Имя</th>
                  <th>Национальность</th>
                  <th>Год рождения</th>
                  <th>Специализация</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.id}>
                    <td>
                      <img 
                        src={artist.image} 
                        alt={artist.name}
                        className="admin-table-image"
                        style={{ borderRadius: '50%' }}
                      />
                    </td>
                    <td>{artist.name}</td>
                    <td>{artist.nationality}</td>
                    <td>{artist.born}</td>
                    <td>{artist.specialty}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(artist)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(artist.id)}
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