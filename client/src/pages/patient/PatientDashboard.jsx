import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await appointmentAPI.getMine();
        setAppointments(data.data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled': return <span className="badge badge-info">Scheduled</span>;
      case 'completed': return <span className="badge badge-success">Completed</span>;
      case 'cancelled': return <span className="badge badge-error">Cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '800' }}>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your health appointments.</p>
        </header>

        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
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
            <div className="stat-icon coral"><XCircle size={24} /></div>
            <div>
              <div className="stat-value">{appointments.filter(a => a.status === 'cancelled').length}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </div>
        </div>

        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '700' }}>Recent Appointments</h2>
            <button className="btn-ghost btn-sm">View All</button>
          </div>
          
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital & Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner"></div></td></tr>
                ) : appointments.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No appointments found. <a href="/search">Book one now!</a></td></tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{appt.hospital?.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Dr. {appt.doctor?.name}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {new Date(appt.date).toLocaleDateString()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}><Clock size={14} /> {appt.slot?.startTime}</div>
                      </td>
                      <td>{getStatusBadge(appt.status)}</td>
                      <td>
                        <button className="btn-outline btn-sm">Details</button>
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

export default PatientDashboard;
