import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTuitionForm, setShowTuitionForm] = useState(false);
  const [tuitionData, setTuitionData] = useState({
    classId: '',
    amount: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchStudent();
    fetchStatus();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/students/${id}`);
      setStudent(response.data.data.student);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get(`/students/${id}/status`);
      setStatus(response.data.data);
    } catch (error) {
      console.error('Error fetching student status:', error);
    }
  };

  const handleAddTuition = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/students/${id}/tuition`, tuitionData);
      alert('Tuition record added successfully');
      setShowTuitionForm(false);
      setTuitionData({ classId: '', amount: '', dueDate: '', status: 'pending' });
      fetchStatus();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add tuition');
    }
  };

  if (loading) {
    return <div className="loading">Loading student details...</div>;
  }

  if (!student) {
    return <div className="error">Student not found</div>;
  }

  return (
    <div className="container">
      <h1>{student.name}</h1>

      <div className="card">
        <h2>Student Information</h2>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone || 'Not provided'}</p>
        <p><strong>Bio:</strong> {student.bio || 'No bio'}</p>
      </div>

      {(user?.role === 'teacher' || user?.role === 'institute_owner' || user?.role === 'secretary') && (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Tuition Records</h2>
              <button onClick={() => setShowTuitionForm(!showTuitionForm)} className="btn btn-primary">
                {showTuitionForm ? 'Cancel' : 'Add Tuition'}
              </button>
            </div>

            {showTuitionForm && (
              <form onSubmit={handleAddTuition} style={{ marginTop: '20px', padding: '20px', background: '#f9fafb', borderRadius: '5px' }}>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={tuitionData.amount}
                    onChange={(e) => setTuitionData({ ...tuitionData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={tuitionData.dueDate}
                    onChange={(e) => setTuitionData({ ...tuitionData, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={tuitionData.status}
                    onChange={(e) => setTuitionData({ ...tuitionData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Tuition</button>
              </form>
            )}

            {status?.tuitions?.length > 0 ? (
              <table className="table" style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {status.tuitions.map((tuition) => (
                    <tr key={tuition._id}>
                      <td>${tuition.amount}</td>
                      <td>{tuition.dueDate ? new Date(tuition.dueDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`badge badge-${tuition.status === 'paid' ? 'success' : tuition.status === 'overdue' ? 'danger' : 'warning'}`}>
                          {tuition.status}
                        </span>
                      </td>
                      <td>{tuition.paidAt ? new Date(tuition.paidAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ marginTop: '20px' }}>No tuition records yet.</p>
            )}
          </div>

          <div className="card">
            <h2>Presentations</h2>
            {status?.presentations?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Date</th>
                    <th>Grade</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {status.presentations.map((presentation) => (
                    <tr key={presentation._id}>
                      <td>{presentation.topic}</td>
                      <td>{new Date(presentation.presentedAt).toLocaleDateString()}</td>
                      <td>{presentation.grade || 'N/A'}</td>
                      <td>{presentation.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No presentations yet.</p>
            )}
          </div>
        </>
      )}

      <div className="card">
        <h2>Homework Submissions</h2>
        {status?.homeworkSubmissions?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {status.homeworkSubmissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.homework?.title}</td>
                  <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${submission.status === 'graded' ? 'success' : 'warning'}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td>{submission.grade || 'Not graded'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No homework submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
