import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ClassCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    maxStudents: 30
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/classes', formData);
      navigate('/classes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create New Class</h1>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Schedule</label>
            <input
              type="text"
              name="schedule"
              className="form-control"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g., Mon/Wed/Fri 10:00 AM - 11:30 AM"
            />
          </div>

          <div className="form-group">
            <label>Max Students</label>
            <input
              type="number"
              name="maxStudents"
              className="form-control"
              value={formData.maxStudents}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Class'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/classes')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassCreate;
