import { useState } from 'react';

interface Props {
  onLogin: (token: string) => void;
  onCancel?: () => void;
}

export default function AdminLogin({ onLogin, onCancel }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Простой клиентский логин без проверки на бэкенде
    const mockToken = 'admin-token-' + Date.now();
    try {
      localStorage.setItem('adminToken', mockToken);
    } catch (e) {}
    onLogin(mockToken);
  };

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
      <h1 className="page-title">Admin Login</h1>
      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="admin-form-group">
          <label>Логин</label>
          <input className="admin-form-group input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Пароль</label>
          <input type="password" className="admin-form-group input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="admin-form-actions">
          <button className="admin-btn" type="submit">Войти</button>
          {onCancel && (
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
