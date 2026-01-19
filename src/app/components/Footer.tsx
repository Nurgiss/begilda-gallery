interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          {/* About Gallery */}
          <div className="footer-column">
            <h3 className="footer-heading">Begilda Gallery</h3>
            <p className="footer-text">
              Modern art gallery presenting works by talented artists. 
              We strive to make art accessible to everyone.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-column">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links">
              <li><a onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home</a></li>
              <li><a onClick={() => onNavigate('catalog')} style={{ cursor: 'pointer' }}>Catalog</a></li>
              <li><a onClick={() => onNavigate('exhibitions')} style={{ cursor: 'pointer' }}>Exhibitions</a></li>
              <li><a onClick={() => onNavigate('artists')} style={{ cursor: 'pointer' }}>Artists</a></li>
              <li><a onClick={() => onNavigate('shop')} style={{ cursor: 'pointer' }}>Shop</a></li>
              <li><a onClick={() => onNavigate('news')} style={{ cursor: 'pointer' }}>News</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="footer-column">
            <h3 className="footer-heading">Contacts</h3>
            <ul className="footer-contact">
              <li>
                <span className="footer-icon">📧</span>
                <a href="mailto:info@begilda.gallery">info@begilda.gallery</a>
              </li>
              <li>
                <span className="footer-icon">📞</span>
                <a href="tel:+77000000000">+7 (700) 000-00-00</a>
              </li>
              <li>
                <span className="footer-icon">📍</span>
                <span>Almaty, Kazakhstan</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-column">
            <h3 className="footer-heading">Social Media</h3>
            <ul className="footer-social">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <h4 className="footer-heading" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Working Hours</h4>
              <p className="footer-text" style={{ fontSize: '0.85rem', margin: 0 }}>
                Mon-Fri: 10:00 - 19:00<br />
                Sat-Sun: 11:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Begilda Gallery. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}