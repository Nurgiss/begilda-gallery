import { useState, useRef } from 'react';
import { uploadImage } from '../../../../api/client';
import type { ArtistFormData } from '../../../../types/forms';

interface ArtistFormProps {
  formData: ArtistFormData;
  isEditMode: boolean;
  onFormChange: (data: ArtistFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ArtistForm({
  formData,
  isEditMode,
  onFormChange,
  onSubmit,
  onCancel
}: ArtistFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof ArtistFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setUploadError(null);

    // Upload the file
    try {
      setUploading(true);
      const result = await uploadImage(file);
      const imageUrl = result.thumb || result.webp || result.original || result.url;
      handleFieldChange('image', imageUrl);
      setLocalPreview(null); // Clear local preview, use server URL
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const previewSrc = localPreview || formData.image;

  return (
    <div className="admin-form-container">
      <h2 className="admin-subtitle">
        {isEditMode ? 'Редактировать артиста' : 'Добавить нового артиста'}
      </h2>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Имя артиста *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Введите имя"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Биография *</label>
          <textarea
            className="form-textarea"
            placeholder="Расскажите об артисте..."
            value={formData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            required
            rows={5}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Фото артиста *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={triggerFileSelect}
              disabled={uploading}
            >
              {uploading ? 'Загрузка...' : 'Выбрать фото'}
            </button>
            {formData.image && !uploading && (
              <span style={{ color: '#28a745', fontSize: '0.9rem' }}>
                ✓ Фото загружено
              </span>
            )}
          </div>
          {uploadError && (
            <p style={{ color: '#dc3545', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              {uploadError}
            </p>
          )}
          {previewSrc && <ImagePreview src={previewSrc} uploading={uploading} />}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Национальность *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Казахстан"
              value={formData.nationality}
              onChange={(e) => handleFieldChange('nationality', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Год рождения *</label>
            <input
              type="text"
              className="form-input"
              placeholder="1985"
              value={formData.born}
              onChange={(e) => handleFieldChange('born', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn" disabled={uploading || !formData.image}>
            {isEditMode ? 'Сохранить' : 'Добавить'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

function ImagePreview({ src, uploading }: { src: string; uploading: boolean }) {
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        position: 'relative'
      }}
    >
      <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
        {uploading ? 'Загрузка...' : 'Предпросмотр:'}
      </p>
      <img
        src={src}
        alt="Preview"
        style={{
          maxWidth: '200px',
          maxHeight: '200px',
          objectFit: 'cover',
          borderRadius: '50%',
          border: '1px solid #dee2e6',
          opacity: uploading ? 0.5 : 1
        }}
      />
    </div>
  );
}
