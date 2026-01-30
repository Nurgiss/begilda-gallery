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
  const handleFieldChange = (field: keyof ArtistFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

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
          <label className="form-label">URL изображения *</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) => handleFieldChange('image', e.target.value)}
            required
          />
          {formData.image && <ImagePreview src={formData.image} />}
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
          <button type="submit" className="btn">
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

function ImagePreview({ src }: { src: string }) {
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}
    >
      <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
        Предпросмотр:
      </p>
      <img
        src={src}
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
  );
}
