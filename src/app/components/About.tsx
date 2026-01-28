export function About() {
  return (
    <section className="about-section">
      <div className="container">
        <h2 className="section-title">About</h2>

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
              Begilda Gallery is a contemporary art gallery based in Almaty, working at the intersection of local cultural context and the global art market. The gallery connects people with the art of their time and builds a professional bridge between Central Asia and the international art scene.

            </p>

            <p className="about-text">
             Begilda Gallery functions as a platform where artists, collectors, and audiences enter a shared professional language — one shaped by curatorial clarity, market awareness, and long-term vision. The gallery focuses on contemporary artistic practices and supports both emerging and established artists through exhibitions, representation, and private sales.
            </p>

            <p className="about-text">
              Rooted in the local context while operating internationally, Begilda Gallery contributes to the formation of a sustainable art ecosystem in the region. The gallery introduces global standards of selection, dialogue, and value, making contemporary art part of informed choice rather than isolated display.

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