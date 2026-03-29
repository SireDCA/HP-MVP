import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signup(form);
      switch (user.role) {
        case 'doctor': navigate('/provider'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-branding">
            <h1>🏥 Health<span>Provida</span></h1>
            <p>Join thousands of patients and providers on Africa's leading healthcare booking platform.</p>
            <div className="auth-features">
              <div className="auth-feature">✅ Free for patients</div>
              <div className="auth-feature">✅ Secure & private</div>
              <div className="auth-feature">✅ Book in under 2 minutes</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Start your healthcare journey</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="John Doe" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required id="signup-name" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required id="signup-email" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Phone (optional)</label>
                <input type="tel" className="form-input" placeholder="+234-800-0000" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} id="signup-phone" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">I am a...</label>
                <select className="form-select" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })} id="signup-role">
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor / Provider</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} id="signup-password" />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="signup-submit">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .auth-container { display: grid; grid-template-columns: 1fr 1fr; max-width: 900px; width: 100%; gap: 3rem; align-items: center; }
        .auth-branding h1 { font-size: var(--font-size-4xl); font-weight: 800; margin-bottom: 1rem; color: var(--text-primary); }
        .auth-branding h1 span { color: var(--primary-500); }
        .auth-branding p { color: var(--text-secondary); font-size: var(--font-size-lg); line-height: 1.7; margin-bottom: 1.5rem; }
        .auth-features { display: flex; flex-direction: column; gap: 0.5rem; }
        .auth-feature { font-size: var(--font-size-sm); color: var(--text-secondary); }
        .auth-card { background: var(--bg-card); border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--shadow-xl); border: 1px solid var(--border-color); }
        .auth-card h2 { font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: 0.25rem; }
        .auth-subtitle { color: var(--text-muted); font-size: var(--font-size-sm); margin-bottom: 1.5rem; }
        .auth-error { background: #fee2e2; color: #991b1b; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: var(--font-size-sm); margin-bottom: 1rem; }
        .auth-switch { text-align: center; margin-top: 1.5rem; font-size: var(--font-size-sm); color: var(--text-muted); }
        .auth-switch a { color: var(--primary-500); font-weight: 600; }
        .form-select { padding: 0.625rem 0.875rem; border: 2px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary); width: 100%; }
        @media (max-width: 768px) { .auth-container { grid-template-columns: 1fr; } .auth-left { display: none; } }
      `}</style>
    </div>
  );
};

export default Signup;
