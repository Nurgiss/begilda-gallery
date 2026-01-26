import { useState } from 'react';
import { login } from '../../../api/client';

interface Props {
  onLogin: (token: string) => void;
  onCancel?: () => void;
}

export default function AdminLogin({ onLogin, onCancel }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      localStorage.setItem('adminToken', response.token);
      onLogin(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('401')) {
        setError('Invalid username or password');
      } else if (message.includes('400')) {
        setError('Please enter both username and password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
      <h1 className="page-title">Admin Login</h1>
      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        {error && (
          <div style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}
        <div className="admin-form-group">
          <label>Логин</label>
          <input
            className="admin-form-group input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="admin-form-group">
          <label>Пароль</label>
          <input
            type="password"
            className="admin-form-group input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="admin-form-actions">
          <button className="admin-btn" type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
          {onCancel && (
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
