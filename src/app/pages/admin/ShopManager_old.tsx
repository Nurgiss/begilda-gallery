import { useState } from 'react';

interface ShopItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ShopManagerProps {
  shopItems: ShopItem[];
  onAddShopItem: (item: Omit<ShopItem, 'id'>) => void;
  onEditShopItem: (item: ShopItem) => void;
  onDeleteShopItem: (id: number) => void;
}

export function ShopManager({ shopItems, onAddShopItem, onEditShopItem, onDeleteShopItem }: ShopManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

  const [formData, setFormData] = useState<Partial<ShopItem>>({
    title: '',
    artist: '',
    price: 0,
    image: '',
    category: '',
    description: ''
  });

  const handleAdd = () => {
    setIsEditing(true);
    setEditingItem(null);
    setFormData({
      title: '',
      artist: '',
      price: 0,
      image: '',
      category: '',
      description: ''
    });
  };

  const handleEdit = (item: ShopItem) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData(item);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this shop item?')) {
      onDeleteShopItem(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      onEditShopItem({ ...editingItem, ...formData } as ShopItem);
    } else {
      onAddShopItem(formData as Omit<ShopItem, 'id'>);
    }

    setIsEditing(false);
    setEditingItem(null);
    setFormData({
      title: '',
      artist: '',
      price: 0,
      image: '',
      category: '',
      description: ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({
      title: '',
      artist: '',
      price: 0,
      image: '',
      category: '',
      description: ''
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">Shop Manager</h1>

        <div className="admin-controls">
          <button className="admin-btn" onClick={handleAdd}>
            Add Shop Item
          </button>
        </div>

        {isEditing && (
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingItem ? 'Edit Shop Item' : 'Add Shop Item'}</h2>

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
              <label className="admin-form-group label">Price ($)</label>
              <input
                type="number"
                className="admin-form-group input"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
              <label className="admin-form-group label">Category</label>
              <input
                type="text"
                className="admin-form-group input"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn">
                {editingItem ? 'Update' : 'Add'}
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
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shopItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.artist}</td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-table-btn"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table-btn danger"
                        onClick={() => handleDelete(item.id)}
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