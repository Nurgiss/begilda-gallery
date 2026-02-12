import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div className="footer-column">
            <img src={logo} alt="Begilda Gallery Logo" style={{ maxWidth: '120px', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
            <p className="footer-text">Modern art gallery presenting works by talented artists. We strive to make art accessible to everyone.</p>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Catalog</Link></li>
              <li><Link to="/exhibitions">Exhibitions</Link></li>
              <li><Link to="/artists">Artists</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/news">News</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Contacts</h3>
            <ul className="footer-contact">
              <li><span className="footer-icon">📧</span><a href="mailto:info@begilda.gallery">info@begilda.gallery</a></li>
              <li><span className="footer-icon">📞</span><a href="tel:+77017192726">+7 (701) 719-27-26</a></li>
              <li><span className="footer-icon">📍</span><span>Almaty, Kazakhstan</span></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">Social Media</h3>
            <ul className="footer-social">
              <li><a href="https://www.instagram.com/begilda_gallery?igsh=bDEycW81OHpvYjZi" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; Begilda Gallery. Art exists to be seen, collected, and lived with.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a><span>•</span><a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
