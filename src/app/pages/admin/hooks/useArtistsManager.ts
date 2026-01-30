import { useState, useEffect, useCallback } from 'react';
import { getArtists, createArtist, updateArtist, deleteArtist } from '../../../../api/client';
import type { Artist } from '../../../../types/models/Artist';
import type { ArtistFormData } from '../../../../types/forms';

const EMPTY_FORM: ArtistFormData = {
  name: '',
  bio: '',
  image: '',
  nationality: '',
  born: ''
};

export interface UseArtistsManagerReturn {
  artists: Artist[];
  loading: boolean;
  isEditing: boolean;
  editingArtist: Artist | null;
  formData: ArtistFormData;
  setFormData: React.Dispatch<React.SetStateAction<ArtistFormData>>;
  handleAdd: () => void;
  handleEdit: (artist: Artist) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
}

export function useArtistsManager(): UseArtistsManagerReturn {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState<ArtistFormData>(EMPTY_FORM);

  const loadArtists = useCallback(async () => {
    try {
      const data = await getArtists();
      setArtists(data);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setEditingArtist(null);
    setFormData(EMPTY_FORM);
  }, []);

  const handleAdd = useCallback(() => {
    setIsEditing(true);
    setEditingArtist(null);
    setFormData(EMPTY_FORM);
  }, []);

  const handleEdit = useCallback((artist: Artist) => {
    setIsEditing(true);
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      image: artist.image,
      nationality: artist.nationality,
      born: artist.born
    });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого артиста?')) {
      return;
    }

    try {
      await deleteArtist(id);
      await loadArtists();
    } catch (error) {
      console.error('Error deleting artist:', error);
      alert('Ошибка при удалении артиста');
    }
  }, [loadArtists]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingArtist) {
        await updateArtist(String(editingArtist.id), formData);
      } else {
        await createArtist(formData);
      }

      await loadArtists();
      resetForm();
    } catch (error) {
      console.error('Error saving artist:', error);
      alert('Ошибка при сохранении артиста');
    }
  }, [editingArtist, formData, loadArtists, resetForm]);

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  return {
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
  };
}
