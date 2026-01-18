import React, { useState } from 'react';
import api from '../../api/client';

interface AdminUploadProps {
  onUpload?: (url: string) => void;
}

export function AdminUpload({ onUpload }: AdminUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    setError(null);
    setResult(null);
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const submit = async () => {
    if (!file) return setError('Выберите файл');
    try {
      setUploading(true);
      const res = await api.uploadImage(file);
      setResult(res);
      // notify parent with a usable URL (thumb preferred)
      const usable = res?.thumb || res?.original || res?.webp;
      if (usable && onUpload) onUpload(usable);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload">
      <h3>Загрузить изображение</h3>
      <div className="upload-row">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        />
        <button className="btn" onClick={submit} disabled={uploading || !file}>
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>

      {preview && (
        <div className="upload-preview">
          <img src={preview} alt="preview" style={{ maxWidth: 240, maxHeight: 240 }} />
        </div>
      )}

      {error && <p className="text-error">{error}</p>}

      {result && (
        <div className="upload-result">
          <p>Сервер вернул:</p>
          <ul>
            {result.original && (
              <li>
                Original: <a href={result.original} target="_blank" rel="noreferrer">{result.original}</a>
              </li>
            )}
            {result.thumb && (
              <li>
                Thumb: <a href={result.thumb} target="_blank" rel="noreferrer">{result.thumb}</a>
              </li>
            )}
            {result.webp && (
              <li>
                WebP: <a href={result.webp} target="_blank" rel="noreferrer">{result.webp}</a>
              </li>
            )}
          </ul>
          {result.webpan && <img src={result.webp} alt="uploaded" style={{ maxWidth: 300 }} />}
        </div>
      )}
    </div>
  );
}

export default AdminUpload;
