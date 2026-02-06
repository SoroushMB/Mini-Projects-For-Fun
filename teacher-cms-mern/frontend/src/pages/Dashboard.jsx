import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="error">Failed to load dashboard</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user?.name}!</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>Role: {user?.role}</p>

      {user?.role === 'student' && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Enrolled Classes</h3>
              <div className="value">{dashboardData.enrolledClasses}</div>
            </div>
            <div className="dashboard-card">
              <h3>Pending Homework</h3>
              <div className="value">{dashboardData.upcomingHomework?.length || 0}</div>
            </div>
            <div className="dashboard-card">
              <h3>Presentations</h3>
              <div className="value">{dashboardData.recentPresentations?.length || 0}</div>
            </div>
          </div>

          <div className="card">
            <h2>My Classes</h2>
            {dashboardData.classes?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Teacher</th>
                    <th>Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.classes.map((cls) => (
                    <tr key={cls._id}>
                      <td>{cls.name}</td>
                      <td>{cls.teacher?.name}</td>
                      <td>{cls.schedule || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No classes enrolled yet.</p>
            )}
          </div>

          {dashboardData.upcomingHomework?.length > 0 && (
            <div className="card">
              <h2>Upcoming Homework</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.upcomingHomework.map((hw) => (
                    <tr key={hw._id}>
                      <td>{hw.title}</td>
                      <td>{hw.class?.name}</td>
                      <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${hw.hasSubmitted ? 'badge-success' : 'badge-warning'}`}>
                          {hw.hasSubmitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {user?.role === 'teacher' && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Classes</h3>
              <div className="value">{dashboardData.totalClasses}</div>
            </div>
            <div className="dashboard-card">
              <h3>Total Students</h3>
              <div className="value">{dashboardData.totalStudents}</div>
            </div>
            <div className="dashboard-card">
              <h3>Pending Grading</h3>
              <div className="value">{dashboardData.pendingGrading?.length || 0}</div>
            </div>
          </div>

          <div className="card">
            <h2>My Classes</h2>
            {dashboardData.classes?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Students</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.classes.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.name}</td>
                      <td>{cls.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No classes created yet.</p>
            )}
          </div>
        </>
      )}

      {user?.role === 'institute_owner' && dashboardData.institute && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Staff</h3>
              <div className="value">{dashboardData.totalStaff}</div>
            </div>
            <div className="dashboard-card">
              <h3>Total Classes</h3>
              <div className="value">{dashboardData.totalClasses}</div>
            </div>
            <div className="dashboard-card">
              <h3>Total Students</h3>
              <div className="value">{dashboardData.totalStudents}</div>
            </div>
          </div>

          <div className="card">
            <h2>Institute: {dashboardData.institute.name}</h2>
            <p>{dashboardData.institute.description}</p>
          </div>

          <div className="card">
            <h2>Staff Members</h2>
            {dashboardData.staff?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.staff.map((staff) => (
                    <tr key={staff.id}>
                      <td>{staff.name}</td>
                      <td>{staff.email}</td>
                      <td>{staff.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No staff members yet.</p>
            )}
          </div>
        </>
      )}

      {(user?.role === 'secretary' || user?.role === 'consultant') && dashboardData.institute && (
        <div className="card">
          <h2>Institute: {dashboardData.institute.name}</h2>
          <p>Role: {dashboardData.role}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
