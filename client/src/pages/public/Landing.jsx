import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">🌍 Serving Sub-Saharan Africa</div>
            <h1>Find & Book <span className="hero-highlight">Healthcare</span> That You Can Trust</h1>
            <p className="hero-description">
              Discover hospitals, preview facilities, and book appointments instantly. Quality healthcare is just a click away.
            </p>
            <div className="hero-actions">
              <Link to="/hospitals" className="btn btn-primary btn-lg">Find Hospitals →</Link>
              <Link to="/signup" className="btn btn-outline btn-lg">Create Free Account</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>150+</strong><span>Hospitals</span></div>
              <div className="hero-stat"><strong>500+</strong><span>Doctors</span></div>
              <div className="hero-stat"><strong>10k+</strong><span>Bookings</span></div>
            </div>
          </div>
        </div>
        <div className="hero-gradient"></div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Book an appointment in 3 simple steps</p>
          <div className="steps-grid">
            {[
              { icon: '🔍', title: 'Search', desc: 'Find hospitals by specialty, location, or symptoms. Filter by facilities, tags, and availability.' },
              { icon: '👀', title: 'Preview', desc: 'Browse facility photos, view doctor profiles, and check real-time availability before booking.' },
              { icon: '✅', title: 'Book', desc: 'Select your preferred time slot, confirm your appointment, and receive instant confirmation.' },
            ].map((step, i) => (
              <div className="step-card card" key={i}>
                <div className="step-number">{i + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why HealthProvida?</h2>
          <div className="features-grid">
            {[
              { icon: '🏥', title: 'Hospital Discovery', desc: 'Search and filter through verified hospitals. View facility images, departments, and available specialists.' },
              { icon: '📅', title: 'Smart Booking', desc: 'Real-time slot availability with intelligent scheduling. No double bookings, easy rescheduling and cancellation.' },
              { icon: '📸', title: 'Visual Previews', desc: 'See reception areas, consulting rooms, wards, and labs before your visit. Build trust before you go.' },
              { icon: '🩺', title: 'Provider Tools', desc: 'Doctors and hospitals get powerful schedule management, patient queue, and availability configuration.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and protected. Role-based access ensures only authorized viewing.' },
              { icon: '📱', title: 'Mobile First', desc: 'Designed for low-bandwidth environments. Works seamlessly on any device, anywhere in Africa.' },
            ].map((f, i) => (
              <div className="feature-card card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Transform Your Healthcare Experience?</h2>
            <p>Join thousands of patients and providers already using HealthProvida.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free →</Link>
              <Link to="/hospitals" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                Browse Hospitals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          position: relative;
          background: var(--gradient-hero);
          padding: 6rem 0 5rem;
          overflow: hidden;
        }
        .hero-gradient {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, var(--bg-secondary), transparent);
        }
        .hero-content { max-width: 700px; color: white; }
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; }
        .hero-highlight { background: linear-gradient(90deg, #4dcaca, #ff7a45); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-description { font-size: var(--font-size-lg); opacity: 0.9; margin-bottom: 2rem; line-height: 1.7; }
        .hero-actions { display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
        .hero-actions .btn-outline { border-color: rgba(255,255,255,0.5); color: white; }
        .hero-actions .btn-outline:hover { background: rgba(255,255,255,0.1); }
        .hero-stats { display: flex; gap: 3rem; }
        .hero-stat { text-align: center; }
        .hero-stat strong { display: block; font-size: var(--font-size-2xl); font-weight: 800; }
        .hero-stat span { font-size: var(--font-size-sm); opacity: 0.7; }

        .how-it-works, .features { padding: 5rem 0; }
        .section-title { text-align: center; font-size: var(--font-size-3xl); font-weight: 800; margin-bottom: 0.5rem; }
        .section-subtitle { text-align: center; color: var(--text-muted); margin-bottom: 3rem; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .step-card { text-align: center; padding: 2rem; position: relative; }
        .step-number { position: absolute; top: 1rem; right: 1rem; width: 28px; height: 28px; border-radius: var(--radius-full); background: var(--primary-100); color: var(--primary-600); font-size: var(--font-size-xs); font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .step-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .step-card h3 { font-size: var(--font-size-lg); font-weight: 700; margin-bottom: 0.5rem; }
        .step-card p { font-size: var(--font-size-sm); color: var(--text-secondary); }

        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .feature-card { padding: 2rem; }
        .feature-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .feature-card h3 { font-size: var(--font-size-base); font-weight: 700; margin-bottom: 0.5rem; }
        .feature-card p { font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.6; }

        .cta-section { padding: 3rem 0 5rem; }
        .cta-card {
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
          padding: 4rem 3rem;
          text-align: center;
          color: white;
        }
        .cta-card h2 { font-size: var(--font-size-3xl); font-weight: 800; margin-bottom: 1rem; }
        .cta-card p { font-size: var(--font-size-lg); opacity: 0.9; margin-bottom: 2rem; }
        .cta-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .hero { padding: 3rem 0 2.5rem; }
          .steps-grid, .features-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 1.5rem; }
          .cta-card { padding: 2.5rem 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
