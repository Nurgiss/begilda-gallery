import { useArtistsManager } from './hooks/useArtistsManager';
import { ArtistForm } from './components/ArtistForm';
import { ArtistsTable } from './components/ArtistsTable';

export function ArtistsManager() {
  const {
    artists,
    loading,
    isEditing,
    editingArtist,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel
  } = useArtistsManager();

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
          <h1 className="admin-title">Управление артистами</h1>
          {!isEditing && (
            <button className="btn" onClick={handleAdd}>
              + Добавить артиста
            </button>
          )}
        </div>

        {isEditing ? (
          <ArtistForm
            formData={formData}
            isEditMode={editingArtist !== null}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <ArtistsTable
            artists={artists}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
