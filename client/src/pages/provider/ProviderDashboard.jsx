import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, availabilityAPI } from '../../services/api';
import { Users, Clock, Calendar, CheckCircle, MoreHorizontal } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await appointmentAPI.getDoctorAppointments();
        setAppointments(data.data || []);
      } catch (err) {
        console.error('Failed to fetch provider appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleComplete = async (id) => {
    try {
      await appointmentAPI.complete(id);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'completed' } : a));
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '800' }}>Provider Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Managing Dr. {user.name}'s schedule.</p>
          </div>
          <button className="btn-primary" onClick={() => window.location.href='/provider/availability'}>Set Availability</button>
        </header>

        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon green"><Users size={24} /></div>
            <div>
              <div className="stat-value">{appointments.length}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><Calendar size={24} /></div>
            <div>
              <div className="stat-value">{appointments.filter(a => a.status === 'scheduled').length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><CheckCircle size={24} /></div>
            <div>
              <div className="stat-value">{appointments.filter(a => a.status === 'completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon coral"><Clock size={24} /></div>
            <div>
              <div className="stat-value">85%</div>
              <div className="stat-label">Punctuality</div>
            </div>
          </div>
        </div>

        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700' }}>Patient Queue</h2>
          </div>
          
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Appointment Time</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner"></div></td></tr>
                ) : appointments.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No patient appointments yet.</td></tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td style={{ fontWeight: '600' }}>{appt.user?.name}</td>
                      <td>
                        <div style={{ fontSize: 'var(--font-size-sm)' }}>{new Date(appt.date).toLocaleDateString()}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>{appt.slot?.startTime}</div>
                      </td>
                      <td>{appt.hospital?.name}</td>
                      <td>
                        <span className={`badge badge-${appt.status === 'scheduled' ? 'info' : appt.status === 'completed' ? 'success' : 'error'}`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        {appt.status === 'scheduled' && (
                          <button 
                            className="btn-primary btn-sm"
                            onClick={() => handleComplete(appt._id)}
                          >
                            Mark Seen
                          </button>
                        )}
                        <button className="btn-ghost btn-sm"><MoreHorizontal size={14} /></button>
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

export default ProviderDashboard;
