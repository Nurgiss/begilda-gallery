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
    
    // Временно без проверки - просто логин
    const mockToken = 'test-token-' + Date.now();
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
          <label>Username</label>
          <input className="admin-form-group input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Password</label>
          <input type="password" className="admin-form-group input" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: 'var(--red)', marginBottom: 'var(--spacing-sm)' }}>{error}</div>}
        <div className="admin-form-actions">
          <button className="admin-btn" type="submit">Sign in</button>
          {onCancel && (
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}
