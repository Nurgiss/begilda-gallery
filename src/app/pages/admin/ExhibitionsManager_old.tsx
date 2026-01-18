import { useState } from 'react';

interface Exhibition {
  id: number;
  title: string;
  artist: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
}

interface ExhibitionsManagerProps {
  exhibitions: Exhibition[];
  onAddExhibition: (exhibition: Omit<Exhibition, 'id'>) => void;
  onEditExhibition: (exhibition: Exhibition) => void;
  onDeleteExhibition: (id: number) => void;
}

export function ExhibitionsManager({ exhibitions, onAddExhibition, onEditExhibition, onDeleteExhibition }: ExhibitionsManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);

  const [formData, setFormData] = useState<Partial<Exhibition>>({
    title: '',
    artist: '',
    location: '',
    dates: '',
    description: '',
    image: '',
    status: 'current'
  });

  const handleAdd = () => {
    setIsEditing(true);
    setEditingExhibition(null);
    setFormData({
      title: '',
      artist: '',
      location: '',
      dates: '',
      description: '',
      image: '',
      status: 'current'
    });
  };

  const handleEdit = (exhibition: Exhibition) => {
    setIsEditing(true);
    setEditingExhibition(exhibition);
    setFormData(exhibition);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this exhibition?')) {
      onDeleteExhibition(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingExhibition) {
      onEditExhibition({ ...editingExhibition, ...formData } as Exhibition);
    } else {
      onAddExhibition(formData as Omit<Exhibition, 'id'>);
    }

    setIsEditing(false);
    setEditingExhibition(null);
    setFormData({
      title: '',
      artist: '',
      location: '',
      dates: '',
      description: '',
      image: '',
      status: 'current'
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingExhibition(null);
    setFormData({
      title: '',
      artist: '',
      location: '',
      dates: '',
      description: '',
      image: '',
      status: 'current'
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">Exhibitions Manager</h1>

        <div className="admin-controls">
          <button className="admin-btn" onClick={handleAdd}>
            Add Exhibition
          </button>
        </div>

        {isEditing && (
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingExhibition ? 'Edit Exhibition' : 'Add Exhibition'}</h2>

            <div className="admin-form-group">
              <label className="admin-form-group label">Title</label>
              <input
                type="text"
                className="admin-form-group input"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Artist</label>
              <input
                type="text"
                className="admin-form-group input"
                value={formData.artist || ''}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Location</label>
              <input
                type="text"
                className="admin-form-group input"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Dates</label>
              <input
                type="text"
                className="admin-form-group input"
                value={formData.dates || ''}
                onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Description</label>
              <textarea
                className="admin-form-group textarea"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Image URL</label>
              <input
                type="url"
                className="admin-form-group input"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-group label">Status</label>
              <select
                className="admin-form-group select"
                value={formData.status || 'current'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'current' | 'upcoming' | 'past' })}
              >
                <option value="current">Current</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn">
                {editingExhibition ? 'Update' : 'Add'}
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Location</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exhibitions.map((exhibition) => (
                <tr key={exhibition.id}>
                  <td>{exhibition.title}</td>
                  <td>{exhibition.artist}</td>
                  <td>{exhibition.location}</td>
                  <td>{exhibition.dates}</td>
                  <td>{exhibition.status}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-table-btn"
                        onClick={() => handleEdit(exhibition)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table-btn danger"
                        onClick={() => handleDelete(exhibition.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}