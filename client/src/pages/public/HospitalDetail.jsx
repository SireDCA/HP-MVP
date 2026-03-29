import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalAPI, imageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HospitalDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hospRes, docRes, imgRes] = await Promise.all([
          hospitalAPI.getOne(id),
          hospitalAPI.getDoctors(id),
          imageAPI.getAll({ hospitalId: id }),
        ]);
        setHospital(hospRes.data.data);
        setDoctors(docRes.data.data);
        setImages(imgRes.data.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!hospital) return <div className="empty-state"><h3>Hospital not found</h3></div>;

  const categories = ['all', 'reception', 'consulting_room', 'ward', 'lab', 'icu'];
  const filteredImages = activeCategory === 'all' ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div className="hospital-detail page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="detail-header animate-fade-in">
          <div>
            <Link to="/hospitals" className="back-link">← Back to Search</Link>
            <h1>{hospital.name}</h1>
            <p className="detail-address">📍 {hospital.address}</p>
            <div className="detail-tags">
              {hospital.tags?.map((tag) => <span className="badge badge-primary" key={tag}>{tag}</span>)}
            </div>
          </div>
          <div className="detail-contact">
            {hospital.phone && <div>📞 {hospital.phone}</div>}
            {hospital.email && <div>📧 {hospital.email}</div>}
          </div>
        </div>

        {/* Description */}
        {hospital.description && (
          <div className="detail-section">
            <p className="detail-description">{hospital.description}</p>
          </div>
        )}

        {/* Image Gallery */}
        <div className="detail-section">
          <h2>📸 Facility Gallery</h2>
          <div className="gallery-tabs">
            {categories.map((cat) => (
              <button key={cat} className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)} style={{ textTransform: 'capitalize' }}>
                {cat === 'all' ? 'All' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
          {filteredImages.length > 0 ? (
            <div className="gallery-grid">
              {filteredImages.map((img) => (
                <div className="gallery-item" key={img._id}>
                  <img src={img.url} alt={img.category} loading="lazy" />
                  <div className="gallery-overlay">
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{img.category?.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>No images in this category</p></div>
          )}
        </div>

        {/* Departments */}
        <div className="detail-section">
          <h2>🏷️ Departments</h2>
          <div className="departments-grid">
            {hospital.departments?.map((dept) => (
              <div className="department-card card" key={dept._id}>
                <h4>{dept.name}</h4>
                {dept.description && <p>{dept.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Doctors */}
        <div className="detail-section">
          <h2>🩺 Our Doctors</h2>
          {doctors.length === 0 ? (
            <div className="empty-state"><p>No doctors listed yet</p></div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doc) => (
                <div className="doctor-card card" key={doc._id}>
                  <div className="doctor-avatar">{doc.name.charAt(0)}</div>
                  <div className="doctor-info">
                    <h4>{doc.name}</h4>
                    <span className="badge badge-info">{doc.specialtyId?.name || 'General'}</span>
                    {isAuthenticated ? (
                      <Link to={`/book/${doc._id}?hospital=${hospital._id}`} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                        Book Appointment
                      </Link>
                    ) : (
                      <Link to="/login" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                        Login to Book
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 2rem; flex-wrap: wrap; }
        .back-link { font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: 0.5rem; display: inline-block; }
        .back-link:hover { color: var(--primary-500); }
        .detail-header h1 { font-size: var(--font-size-3xl); font-weight: 800; margin-bottom: 0.5rem; }
        .detail-address { color: var(--text-secondary); margin-bottom: 0.75rem; }
        .detail-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .detail-contact { font-size: var(--font-size-sm); color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.5rem; }
        .detail-description { font-size: var(--font-size-base); color: var(--text-secondary); line-height: 1.7; max-width: 800px; }
        .detail-section { margin-bottom: 3rem; }
        .detail-section h2 { font-size: var(--font-size-xl); font-weight: 700; margin-bottom: 1.25rem; }
        .gallery-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border-color); margin-bottom: 1.5rem; overflow-x: auto; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
        .gallery-item { position: relative; border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 4/3; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
        .gallery-item:hover img { transform: scale(1.05); }
        .gallery-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 0.75rem; background: linear-gradient(transparent, rgba(0,0,0,0.6)); }
        .departments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .department-card h4 { font-size: var(--font-size-sm); font-weight: 700; margin-bottom: 0.25rem; }
        .department-card p { font-size: var(--font-size-xs); color: var(--text-muted); }
        .doctors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
        .doctor-card { display: flex; align-items: flex-start; gap: 1rem; }
        .doctor-avatar { width: 48px; height: 48px; border-radius: var(--radius-full); background: var(--primary-100); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: var(--font-size-lg); flex-shrink: 0; }
        .doctor-info { display: flex; flex-direction: column; }
        .doctor-info h4 { font-size: var(--font-size-sm); font-weight: 700; margin-bottom: 0.25rem; }
        @media (max-width: 768px) {
          .detail-header { flex-direction: column; }
          .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        }
      `}</style>
    </div>
  );
};

export default HospitalDetail;
