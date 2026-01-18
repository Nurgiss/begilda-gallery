import { useState, useEffect } from 'react';
import { getCurrencyRates, setManualRates, clearRatesCache } from '../../../api/currency';

export function CurrencySettings() {
  const [rates, setRates] = useState({ usd: 0, eur: 0, lastUpdate: '' });
  const [manualUSD, setManualUSD] = useState('');
  const [manualEUR, setManualEUR] = useState('');

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    const currentRates = await getCurrencyRates();
    setRates(currentRates);
    setManualUSD(currentRates.usd.toString());
    setManualEUR(currentRates.eur.toString());
  };

  const handleUpdateRates = () => {
    const usd = parseFloat(manualUSD);
    const eur = parseFloat(manualEUR);

    if (usd > 0 && eur > 0) {
      setManualRates(usd, eur);
      loadRates();
      alert('✅ Курсы валют обновлены!');
    } else {
      alert('❌ Введите корректные значения курсов');
    }
  };

  const handleClearCache = () => {
    if (confirm('Очистить кэш курсов? Курсы будут загружены заново.')) {
      clearRatesCache();
      loadRates();
      alert('✅ Кэш очищен. Курсы обновлены.');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="admin-title">⚙️ Настройки валют</h1>

        <div className="admin-form-container" style={{ maxWidth: '600px' }}>
          <h2 className="admin-subtitle">Текущие курсы</h2>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>💵 USD:</strong> ₸ {rates.usd.toFixed(2)}
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>💶 EUR:</strong> ₸ {rates.eur.toFixed(2)}
              </p>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#666' }}>
              📅 Обновлено: {rates.lastUpdate}
            </p>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Установить курсы вручную
          </h3>

          <div className="form-group">
            <label className="form-label">Курс USD к KZT</label>
            <input
              type="number"
              className="form-input"
              placeholder="478.50"
              step="0.01"
              value={manualUSD}
              onChange={(e) => setManualUSD(e.target.value)}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Например: 478.50 (1 USD = 478.50 KZT)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Курс EUR к KZT</label>
            <input
              type="number"
              className="form-input"
              placeholder="520.80"
              step="0.01"
              value={manualEUR}
              onChange={(e) => setManualEUR(e.target.value)}
            />
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Например: 520.80 (1 EUR = 520.80 KZT)
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn" onClick={handleUpdateRates}>
              ✅ Обновить курсы
            </button>
            <button className="btn btn-secondary" onClick={handleClearCache}>
              🔄 Очистить кэш
            </button>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '1px solid #90caf9'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1565c0' }}>
              💡 <strong>Подсказка:</strong> Курсы автоматически загружаются с API Нацбанка РК. 
              Если курсы неверные, вы можете установить их вручную. Кэш обновляется каждый час.
            </p>
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            border: '1px solid #ffc107'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
              ⚠️ <strong>Важно:</strong> Актуальные курсы можно проверить на 
              <a href="https://nationalbank.kz" target="_blank" rel="noopener" style={{ marginLeft: '0.25rem' }}>
                nationalbank.kz
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
