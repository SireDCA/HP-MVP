const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>🏥 Health<span style={{ color: 'var(--primary-400)' }}>Provida</span></h3>
          <p>Transforming healthcare access across Sub-Saharan Africa through seamless digital booking and provider discovery.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/hospitals">Find Hospitals</a></li>
            <li><a href="/signup">Create Account</a></li>
            <li><a href="/login">Sign In</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>📧 support@healthprovida.com</li>
            <li>📞 +234-800-HEALTH</li>
            <li>📍 Lagos, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HealthProvida. All rights reserved.</p>
      </div>
    </div>

    <style>{`
      .site-footer {
        background: var(--gray-900);
        color: var(--gray-400);
        padding: 3rem 0 1.5rem;
        margin-top: 4rem;
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--gray-800);
      }
      .footer-brand h3 {
        font-size: var(--font-size-xl);
        color: white;
        margin-bottom: 0.75rem;
      }
      .footer-brand p { font-size: var(--font-size-sm); line-height: 1.6; }
      .site-footer h4 {
        color: white;
        font-size: var(--font-size-sm);
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
      .site-footer ul { display: flex; flex-direction: column; gap: 0.5rem; }
      .site-footer li { font-size: var(--font-size-sm); }
      .site-footer a { color: var(--gray-400); }
      .site-footer a:hover { color: var(--primary-400); }
      .footer-bottom {
        text-align: center;
        padding-top: 1.5rem;
        font-size: var(--font-size-xs);
        color: var(--gray-600);
      }
      @media (max-width: 768px) {
        .footer-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 480px) {
        .footer-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </footer>
);

export default Footer;
