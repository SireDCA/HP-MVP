import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'doctor': navigate('/provider'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
            <p>Access quality healthcare across Sub-Saharan Africa with seamless hospital discovery and booking.</p>
            <div className="auth-features">
              <div className="auth-feature">✅ Find hospitals near you</div>
              <div className="auth-feature">✅ Book appointments instantly</div>
              <div className="auth-feature">✅ Preview facilities before visiting</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  id="login-email"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  id="login-password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="login-submit">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>

            <div className="auth-demo">
              <p>Demo Accounts:</p>
              <button className="demo-btn" onClick={() => setForm({ email: 'patient@healthprovida.com', password: 'patient123' })}>
                👤 Patient
              </button>
              <button className="demo-btn" onClick={() => setForm({ email: 'amara@healthprovida.com', password: 'doctor123' })}>
                🩺 Doctor
              </button>
              <button className="demo-btn" onClick={() => setForm({ email: 'admin@healthprovida.com', password: 'admin123' })}>
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .auth-container { display: grid; grid-template-columns: 1fr 1fr; max-width: 900px; width: 100%; gap: 3rem; align-items: center; }
        .auth-left { } 
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
        .auth-demo { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
        .auth-demo p { font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: 0.5rem; text-align: center; }
        .demo-btn { background: var(--gray-100); border: 1px solid var(--border-color); padding: 0.375rem 0.75rem; border-radius: var(--radius-sm); font-size: var(--font-size-xs); cursor: pointer; margin: 0.25rem; transition: all var(--transition-fast); }
        .demo-btn:hover { background: var(--primary-100); border-color: var(--primary-300); }
        @media (max-width: 768px) { .auth-container { grid-template-columns: 1fr; } .auth-left { display: none; } .auth-card { padding: 1.5rem; } }
      `}</style>
    </div>
  );
};

export default Login;
