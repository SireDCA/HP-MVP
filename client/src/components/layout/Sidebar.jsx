import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  const patientLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/dashboard/appointments', icon: '📅', label: 'My Appointments' },
    { to: '/hospitals', icon: '🏥', label: 'Find Hospitals' },
  ];

  const providerLinks = [
    { to: '/provider', icon: '📊', label: 'Dashboard' },
    { to: '/provider/schedule', icon: '🗓️', label: 'My Schedule' },
    { to: '/provider/patients', icon: '👥', label: 'Patients' },
  ];

  const adminLinks = [
    { to: '/admin', icon: '📊', label: 'Dashboard' },
    { to: '/admin/hospitals', icon: '🏥', label: 'Manage Hospitals' },
    { to: '/admin/departments', icon: '🏷️', label: 'Departments' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? providerLinks : patientLinks;
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'doctor' ? 'Provider' : 'Patient';

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-profile">
        <div className="sidebar-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
        <div>
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-role">{roleLabel}</div>
        </div>
      </div>

      <div className="sidebar-section">Navigation</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/provider' || link.to === '/admin'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 0.5rem;
        }
        .sidebar-avatar {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-full);
          background: var(--primary-500);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--font-size-lg);
        }
        .sidebar-user-name {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: white;
        }
        .sidebar-role {
          font-size: var(--font-size-xs);
          color: var(--gray-500);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
