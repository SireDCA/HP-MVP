import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { hospitalAPI, departmentAPI } from '../../services/api';

const HospitalSearch = () => {
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    tags: searchParams.get('tags') || '',
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const { data } = await departmentAPI.getAll();
        setDepartments(data.data);
      } catch (err) { console.error(err); }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    const loadHospitals = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.department) params.department = filters.department;
        if (filters.tags) params.tags = filters.tags;
        const { data } = await hospitalAPI.getAll(params);
        setHospitals(data.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    loadHospitals();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(filters);
  };

  const tags = ['Modern', 'ICU-equipped', 'Child-friendly', 'Wheelchair accessible', 'Emergency Services', 'Teaching Hospital'];

  return (
    <div className="search-page page-wrapper">
      <div className="container">
        <div className="search-header">
          <h1>Find Hospitals</h1>
          <p>Search through verified hospitals across Sub-Saharan Africa</p>
        </div>

        <form className="search-bar-wrapper" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by hospital name, location, or specialty..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            id="hospital-search"
          />
          <button type="submit" className="btn btn-primary" id="hospital-search-btn">Search</button>
        </form>

        <div className="search-layout">
          <aside className="filter-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <label className="form-label">Department / Specialty</label>
              <select className="form-select" value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })} id="filter-department">
                <option value="">All Specialties</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Tags</label>
              <div className="tag-filters">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-filter-btn ${filters.tags === tag ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, tags: filters.tags === tag ? '' : tag })}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {(filters.search || filters.department || filters.tags) && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ search: '', department: '', tags: '' })} style={{ width: '100%' }}>
                Clear All Filters
              </button>
            )}
          </aside>

          <div className="search-results">
            {loading ? (
              <div className="loading-page"><div className="spinner"></div><p>Finding hospitals...</p></div>
            ) : hospitals.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">🏥</div>
                <h3>No hospitals found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="hospital-grid grid grid-2">
                {hospitals.map((hospital) => (
                  <Link to={`/hospitals/${hospital._id}`} className="hospital-card card" key={hospital._id}>
                    <div className="hospital-card-image">
                      {hospital.images?.[0] ? (
                        <img src={hospital.images[0].url} alt={hospital.name} />
                      ) : (
                        <div className="hospital-placeholder">🏥</div>
                      )}
                    </div>
                    <div className="hospital-card-body">
                      <h3>{hospital.name}</h3>
                      <p className="hospital-address">📍 {hospital.address}</p>
                      <div className="hospital-tags">
                        {hospital.tags?.slice(0, 3).map((tag) => (
                          <span className="badge badge-primary" key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="hospital-departments">
                        {hospital.departments?.slice(0, 3).map((d) => (
                          <span className="badge badge-info" key={d._id}>{d.name}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .search-header { margin-bottom: 2rem; }
        .search-header h1 { font-size: var(--font-size-3xl); font-weight: 800; }
        .search-header p { color: var(--text-muted); }
        .search-bar-wrapper { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
        .search-input { flex: 1; }
        .search-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; }
        .filter-sidebar { background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); height: fit-content; position: sticky; top: 86px; }
        .filter-sidebar h3 { font-size: var(--font-size-base); font-weight: 700; margin-bottom: 1.25rem; }
        .filter-group { margin-bottom: 1.25rem; }
        .filter-group .form-select { width: 100%; }
        .tag-filters { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .tag-filter-btn { padding: 0.25rem 0.625rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); background: var(--bg-primary); font-size: var(--font-size-xs); cursor: pointer; transition: all var(--transition-fast); }
        .tag-filter-btn:hover, .tag-filter-btn.active { background: var(--primary-100); border-color: var(--primary-400); color: var(--primary-700); }
        .hospital-card { padding: 0; overflow: hidden; text-decoration: none; color: inherit; }
        .hospital-card:hover { transform: translateY(-4px); }
        .hospital-card-image { height: 180px; overflow: hidden; background: var(--gray-100); }
        .hospital-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
        .hospital-card:hover .hospital-card-image img { transform: scale(1.05); }
        .hospital-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--gray-100); }
        .hospital-card-body { padding: 1.25rem; }
        .hospital-card-body h3 { font-size: var(--font-size-base); font-weight: 700; margin-bottom: 0.375rem; }
        .hospital-address { font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: 0.75rem; }
        .hospital-tags, .hospital-departments { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 0.5rem; }
        @media (max-width: 768px) {
          .search-layout { grid-template-columns: 1fr; }
          .filter-sidebar { position: static; }
          .search-bar-wrapper { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default HospitalSearch;
