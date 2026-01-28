export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">
         For sales, commissions, and general inquiries
        </p>

        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:artist@example.com" className="contact-link">
              info@begildagallery.com
            </a>
          </div>

          

          <div className="contact-item">
            <span className="contact-label">Instagram</span>
            <a href="https://www.instagram.com/begilda_gallery/" target="_new" className="contact-link">
              @begilda_gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
