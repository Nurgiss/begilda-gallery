export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-title">
          <h2>Contact</h2>
          <p className="subtitle">For sales, commissions, and general inquiries</p>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-label">Email</span>
            <a href="mailto:artist@example.com" className="contact-link">
              info@begildagallery.com
            </a>
          </div>

          

          <div className="contact-item">
            <span className="contact-label">Instagram</span>
            <a href="https://www.instagram.com/begilda_gallery?igsh=bDEycW81OHpvYjZi" target="_blank" rel="noopener noreferrer" className="contact-link">
              @begilda_gallery
            </a>
          </div>
        </div>

        {/* Address section with map */}
        <div className="contact-address-block">
          <div className="contact-address-text">
            <h3 className="contact-address-title">Gallery Address</h3>
            <p className="contact-address-details">
              115 Nauryzbay batyr st.<br />
              Almaty, 050022<br />
              Kazakhstan
            </p>
          </div>
          <div className="contact-address-map">
            <iframe
              src="https://maps.google.com/maps?q=115+Nauryzbay+batyr+st,+Almaty,+050022,+Kazakhstan&output=embed&hl=en"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Begilda Gallery Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
