import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ClassDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassDetails();
    if (user?.role === 'teacher' || user?.role === 'institute_owner') {
      fetchStudents();
    }
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      const response = await api.get(`/classes/${id}`);
      setClassData(response.data.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
      setError('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    try {
      await api.post(`/classes/${id}/enroll`, { studentId: selectedStudent });
      alert('Student enrolled successfully');
      fetchClassDetails();
      setSelectedStudent('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll student');
    }
  };

  const handleUnenroll = async (studentId) => {
    if (!window.confirm('Are you sure you want to unenroll this student?')) {
      return;
    }

    try {
      await api.post(`/classes/${id}/unenroll`, { studentId });
      alert('Student unenrolled successfully');
      fetchClassDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to unenroll student');
    }
  };

  if (loading) {
    return <div className="loading">Loading class details...</div>;
  }

  if (error || !classData) {
    return <div className="error">{error || 'Class not found'}</div>;
  }

  const availableStudents = students.filter(
    (student) => !classData.students?.some((s) => s._id === student._id)
  );

  return (
    <div className="container">
      <h1>{classData.name}</h1>

      <div className="card">
        <h2>Class Information</h2>
        <p><strong>Description:</strong> {classData.description || 'No description'}</p>
        <p><strong>Schedule:</strong> {classData.schedule || 'Not set'}</p>
        <p><strong>Teacher:</strong> {classData.teacher?.name}</p>
        <p><strong>Max Students:</strong> {classData.maxStudents}</p>
        <p><strong>Enrolled Students:</strong> {classData.students?.length || 0}</p>
      </div>

      {(user?.role === 'teacher' || user?.role === 'institute_owner') && (
        <div className="card">
          <h2>Enroll Student</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Select Student</label>
              <select
                className="form-control"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">-- Select Student --</option>
                {availableStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleEnroll} className="btn btn-primary">
              Enroll
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Enrolled Students</h2>
        {classData.students?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {(user?.role === 'teacher' || user?.role === 'institute_owner') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {classData.students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  {(user?.role === 'teacher' || user?.role === 'institute_owner') && (
                    <td>
                      <button
                        onClick={() => handleUnenroll(student._id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px' }}
                      >
                        Unenroll
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default ClassDetail;
