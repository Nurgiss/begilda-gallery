export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact Me</h2>
        <p className="section-subtitle">
          Ready to answer your questions about the works and discuss custom orders
        </p>

        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:artist@example.com" className="contact-link">
              artist@example.com
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-label">Phone</span>
            <a href="tel:+79991234567" className="contact-link">
              +7 (999) 123-45-67
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-label">Instagram</span>
            <a href="#" className="contact-link">
              @artist_gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
