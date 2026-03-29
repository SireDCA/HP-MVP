import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalAPI } from '../../services/api';
import { Building, Users, Calendar, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data } = await hospitalAPI.getAll();
        setHospitals(data.data || []);
      } catch (err) {
        console.error('Failed to fetch admin hospitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '800' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>System-wide oversight as {user?.name}.</p>
          </div>
          <button className="btn-primary" onClick={() => window.location.href='/admin/hospitals/new'}>
            <Plus size={18} /> Add New Hospital
          </button>
        </header>

        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon teal"><Building size={24} /></div>
            <div>
              <div className="stat-value">{hospitals.length}</div>
              <div className="stat-label">Registered Hospitals</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon coral"><Users size={24} /></div>
            <div>
              <div className="stat-value">1,248</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Calendar size={24} /></div>
            <div>
              <div className="stat-value">482</div>
              <div className="stat-label">Bookings (MTD)</div>
            </div>
          </div>
        </div>

        <section className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700' }}>Hospital Management</h2>
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <div className="form-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} color="var(--text-muted)" />
                <input type="text" placeholder="Search facilities..." style={{ border: 'none', background: 'none', outline: 'none', width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Location</th>
                  <th>Doctors</th>
                  <th>Departments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner"></div></td></tr>
                ) : hospitals.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No hospitals in the system.</td></tr>
                ) : (
                  hospitals.map((h) => (
                    <tr key={h._id}>
                      <td style={{ fontWeight: '600' }}>{h.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{h.location}</td>
                      <td>12 Doctors</td>
                      <td>8 Depts</td>
                      <td style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-ghost btn-sm" title="Edit"><Edit2 size={16} /></button>
                        <button className="btn-ghost btn-sm" style={{ color: 'var(--error)' }} title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
