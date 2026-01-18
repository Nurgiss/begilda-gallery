export function About() {
  return (
    <section className="about-section">
      <div className="container">
        <h2 className="section-title">About the Gallery</h2>

        <div className="about-grid">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Gallery Interior"
              className="about-image"
            />
          </div>

          <div className="about-content">
            <p className="about-text">
              Begilda Gallery was founded in 2012 as a space for contemporary painting and
              curated exhibitions. Over the last decade the gallery has hosted solo and group
              shows, supported emerging artists, and built a dedicated community of collectors
              and art lovers.
            </p>

            <p className="about-text">
              Our mission is to present thoughtful, well‑produced exhibitions that explore
              narrative, materiality and craft. We collaborate with artists to develop
              projects, publish limited catalogs, and connect works with private and public
              collections.
            </p>

            <p className="about-text">
              Located in the heart of the city, Begilda Gallery provides a quiet, contemplative
              setting where visitors can experience artworks closely, attend opening events,
              and arrange private viewings by appointment.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Years in Operation</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">120+</span>
                <span className="stat-label">Exhibitions Hosted</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">300+</span>
                <span className="stat-label">Works Sold</span>
              </div>
            </div>

            <p className="about-text">
              Founders: Begilda Akhmetova &amp; Artem Novikov — curators and collectors who
              established the gallery to support contemporary painting and nurture long‑term
              relationships between artists and collectors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}