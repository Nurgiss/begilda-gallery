import { useState, useEffect } from 'react';
import { getPaintings, createPainting, updatePainting, deletePainting, getArtists, uploadImage } from '../../../api/client';
import { convertUSDtoKZT, convertUSDtoEUR, getCurrencyRates } from '../../../api/currency';
import type { Painting } from '../../../types/models/Painting';
import type { Artist } from '../../../types/models/Artist';
import type { PaintingFormData } from '../../../types/forms';

export function PaintingsManager() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<PaintingFormData>({
    title: '',
    artist: '',
    year: new Date().getFullYear(),
    priceUSD: 0,
    dimensions: '',
    category: 'abstract',
    description: '',
    image: '',
    medium: '',
    availability: true,
    featured: false,
    exhibitionOnly: false
  });
  
  const [calculatedPrices, setCalculatedPrices] = useState({
    kzt: 0,
    eur: 0
  });
  
  const [currencyRates, setCurrencyRates] = useState({ usd: 470, eur: 510, lastUpdate: '' });

  useEffect(() => {
    loadPaintings();
    loadArtists();
    loadCurrencyRates();
  }, []);
  
  const loadCurrencyRates = async () => {
    try {
      const rates = await getCurrencyRates();
      setCurrencyRates(rates);
    } catch (error) {
      console.error('Error loading currency rates:', error);
    }
  };
  
  // Пересчитываем цены при изменении USD
  useEffect(() => {
    if (formData.priceUSD > 0) {
      calculatePrices(formData.priceUSD);
    }
  }, [formData.priceUSD]);
  
  const calculatePrices = async (usdPrice: number) => {
    try {
      const kzt = await convertUSDtoKZT(usdPrice);
      const eur = await convertUSDtoEUR(usdPrice);
      setCalculatedPrices({ kzt, eur });
    } catch (error) {
      console.error('Error calculating prices:', error);
    }
  };

  const loadPaintings = async () => {
    try {
      const data = await getPaintings();
      setPaintings(data);
    } catch (error) {
      console.error('Error loading paintings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadArtists = async () => {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    }
  };
  
  const handleAdd = () => {
    setIsEditing(true);
    setEditingPainting(null);
    setFormData({
      title: '',
      artist: '',
      year: new Date().getFullYear(),
      priceUSD: 0,
      dimensions: '',
      category: 'abstract',
      description: '',
      image: '',
      medium: '',
      availability: true,
      featured: false,
      exhibitionOnly: false
    });
    setCalculatedPrices({ kzt: 0, eur: 0 });
  };
  
  const handleEdit = (painting: Painting) => {
    setIsEditing(true);
    setEditingPainting(painting);
    setFormData({
      title: painting.title,
      artist: painting.artist || '',
      year: painting.year,
      priceUSD: painting.priceUSD || 0,
      dimensions: painting.dimensions,
      category: painting.category || 'abstract',
      description: painting.description,
      image: painting.image || painting.imageUrl || '',
      medium: painting.medium,
      availability: painting.availability,
      featured: painting.featured || false,
      exhibitionOnly: painting.exhibitionOnly || false
    });
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту картину?')) {
      try {
        await deletePainting(id);
        await loadPaintings();
      } catch (error) {
        console.error('Error deleting painting:', error);
        alert('Ошибка при удалении картины');
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
      // Добавляем рассчитанные цены к данным формы
      const paintingData = {
        ...formData,
        price: calculatedPrices.kzt,
        priceEUR: calculatedPrices.eur
      };
      
      if (editingPainting) {
        await updatePainting(String(editingPainting.id), paintingData);
      } else {
        await createPainting(paintingData);
      }
      
      await loadPaintings();
      setIsEditing(false);
      setEditingPainting(null);
    } catch (error) {
      console.error('Error saving painting:', error);
      alert('Ошибка при сохранении картины');
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingPainting(null);
  };
  
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header-section">
          <h1 className="admin-title">Управление картинами</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить картину
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Загрузка...</p>
        ) : isEditing ? (
          <div className="admin-form-container">
            <h2 className="admin-subtitle">
              {editingPainting ? 'Редактировать картину' : 'Добавить новую картину'}
            </h2>
            
            <form onSubmit={handleSubmit} className="admin-form">
              {/* Основная информация */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Основная информация</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Название картины *</label>
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
                    <label className="form-label">Артист</label>
                    <select
                      className="form-select"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    >
                      <option value="">Не выбран</option>
                      {artists.map(artist => (
                        <option key={artist.id} value={artist.name}>
                          {artist.name}
                        </option>
                      ))}
                    </select>
                    {artists.length === 0 && (
                      <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                        Сначала добавьте артистов в разделе "Артисты"
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Год создания</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="2024"
                      min="1900"
                      max="2100"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="abstract">Abstract</option>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Технические характеристики */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Технические характеристики</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Размеры *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Например: 100x80 см или 120x90x3 см"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      required
                    />
                    <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      💡 Укажите размеры в формате: ширина × высота (× глубина если есть) в см
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Техника исполнения</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Например: Масло на холсте, Акрил, Акварель..."
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    />
                    <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      🎨 Укажите материалы и технику
                    </small>
                  </div>
                </div>
              </div>
              
              {/* Стоимость */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', margin: 0 }}>💰 Стоимость</h3>
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    💱 Курс: $1 = ₸{currencyRates.usd.toFixed(2)} | €1 = ₸{currencyRates.eur.toFixed(2)}
                  </small>
                </div>
                
                <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Цена в долларах ($) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="550"
                      min="0"
                      step="10"
                      value={formData.priceUSD || ''}
                      onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                      required
                      style={{ fontSize: '1.1rem', fontWeight: '600' }}
                    />
                    <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      💡 Укажите цену в долларах - остальные валюты рассчитаются автоматически
                    </small>
                  </div>
                </div>
                
                {/* Автоматически рассчитанные цены */}
                {formData.priceUSD > 0 && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1.25rem', 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: '8px',
                    border: '1px solid #a5d6a7'
                  }}>
                    <p style={{ margin: 0, marginBottom: '0.75rem', fontSize: '0.9rem', color: '#2e7d32', fontWeight: '600' }}>
                      ✅ Автоматически рассчитанные цены:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>В тенге:</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1b5e20' }}>
                          ₸ {calculatedPrices.kzt.toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>В долларах:</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1b5e20' }}>
                          $ {formData.priceUSD.toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>В евро:</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1b5e20' }}>
                          € {calculatedPrices.eur.toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Изображение */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>🖼️ Изображение</h3>
                
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600' }}>Загрузить изображение картины *</label>
                  <div style={{ 
                    border: '2px dashed #dee2e6', 
                    borderRadius: '8px', 
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="file"
                      className="form-input"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ 
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    />
                    <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                      📌 Поддерживаемые форматы: JPG, PNG, WEBP (макс. 10 МБ)
                    </small>
                  </div>
                  
                  {uploadingImage && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1rem', 
                      backgroundColor: '#e3f2fd', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '3px solid #1976d2',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span style={{ color: '#1565c0', fontSize: '0.95rem', fontWeight: '500' }}>
                        Загрузка изображения...
                      </span>
                    </div>
                  )}
                  
                  {formData.image && !uploadingImage && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1.5rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <p style={{ 
                        marginBottom: '1rem', 
                        fontSize: '0.9rem', 
                        color: '#495057',
                        fontWeight: '600'
                      }}>
                        ✅ Изображение загружено
                      </p>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '400px', 
                          objectFit: 'contain', 
                          borderRadius: '8px',
                          border: '1px solid #dee2e6',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Описание */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>📝 Описание</h3>
                
                <div className="form-group">
                  <label className="form-label">Описание картины *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Расскажите о картине: что вдохновило, какие техники использовались, какое настроение передает произведение...&#10;&#10;Например:&#10;Эта картина создана в период творческого подъема автора. Яркие цвета и динамичные мазки передают энергию и движение. В основе композиции лежит контраст между теплыми и холодными оттенками."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    style={{ resize: 'vertical', fontSize: '0.95rem', lineHeight: '1.6' }}
                  />
                  <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    {formData.description?.length || 0} символов
                  </small>
                </div>
              </div>
              
              {/* Статус и настройки */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>Статус и настройки</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Доступность</label>
                    <select
                      className="form-select"
                      value={formData.availability ? 'available' : 'sold'}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value === 'available' })}
                    >
                      <option value="available">✓ В наличии</option>
                      <option value="sold">✗ Продано</option>
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.8rem' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>⭐ Отображать в избранном</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formData.exhibitionOnly}
                        onChange={(e) => setFormData({ ...formData, exhibitionOnly: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.95rem' }}>🎨 Только для выставки (скрыть из каталога)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="admin-form-actions">
                <button type="submit" className="btn">
                  {editingPainting ? 'Сохранить' : 'Добавить'}
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
                  <th>Артист</th>
                  <th>Цена</th>
                  <th>Размер</th>
                  <th>Категория</th>
                  <th>Статус</th>
                  <th>Избранное</th>
                  <th>Только для выставки</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {paintings.map(painting => (
                  <tr key={painting.id}>
                    <td>
                      <img 
                        src={painting.image || painting.imageUrl} 
                        alt={painting.title}
                        className="admin-table-image"
                      />
                    </td>
                    <td>{painting.title}</td>
                    <td>{painting.artist}</td>
                    <td>{painting.price?.toLocaleString('ru-RU')} ₸</td>
                    <td>{painting.dimensions || painting.size}</td>
                    <td>
                      {painting.category === 'abstract' && 'Abstract'}
                      {painting.category === 'landscape' && 'Landscape'}
                      {painting.category === 'portrait' && 'Portrait'}
                      {painting.category === 'modern' && 'Modern'}
                    </td>
                    <td>
                      <span className={`admin-status ${painting.availability !== false ? 'admin-status-available' : 'admin-status-sold'}`}>
                        {painting.availability !== false ? 'В наличии' : 'Продано'}
                      </span>
                    </td>
                    <td>
                      {painting.featured ? '✓' : '—'}
                    </td>
                    <td>
                      {painting.exhibitionOnly ? '🎨 Да' : '—'}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button 
                          className="admin-btn-edit"
                          onClick={() => handleEdit(painting)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(String(painting.id))}
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
