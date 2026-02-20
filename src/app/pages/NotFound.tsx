import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Страница не найдена</h2>
          <p className="not-found-text">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn">
              Вернуться на главную
            </Link>
            <Link to="/catalog" className="btn btn-secondary">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
