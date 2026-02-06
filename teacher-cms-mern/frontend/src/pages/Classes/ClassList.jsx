import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading classes...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Classes</h1>
        <Link to="/classes/create" className="btn btn-primary">
          Create New Class
        </Link>
      </div>

      {classes.length > 0 ? (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Teacher</th>
                <th>Schedule</th>
                <th>Students</th>
                <th>Max Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td>{cls.name}</td>
                  <td>{cls.teacher?.name}</td>
                  <td>{cls.schedule || 'N/A'}</td>
                  <td>{cls.students?.length || 0}</td>
                  <td>{cls.maxStudents}</td>
                  <td>
                    <Link to={`/classes/${cls._id}`} className="btn btn-primary" style={{ fontSize: '12px' }}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <p>No classes found. Create your first class!</p>
        </div>
      )}
    </div>
  );
};

export default ClassList;
