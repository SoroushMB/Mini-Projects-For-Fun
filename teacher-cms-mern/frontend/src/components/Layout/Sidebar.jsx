import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const menuItems = {
    student: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/classes', label: 'My Classes' },
      { path: '/homework', label: 'Homework' },
      { path: '/quizzes', label: 'Quizzes' },
      { path: '/messages', label: 'Messages' }
    ],
    teacher: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/classes', label: 'Classes' },
      { path: '/classes/create', label: 'Create Class' },
      { path: '/students', label: 'Students' },
      { path: '/quizzes', label: 'Quizzes' },
      { path: '/question-banks', label: 'Question Banks' },
      { path: '/messages', label: 'Messages' },
      { path: '/institute/create', label: 'Create Institute' }
    ],
    institute_owner: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/institute', label: 'My Institute' },
      { path: '/classes', label: 'Classes' },
      { path: '/classes/create', label: 'Create Class' },
      { path: '/students', label: 'Students' },
      { path: '/institute/hire', label: 'Hire Staff' },
      { path: '/quizzes', label: 'Quizzes' },
      { path: '/messages', label: 'Messages' }
    ],
    secretary: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/institute', label: 'Institute' },
      { path: '/students', label: 'Students' },
      { path: '/messages', label: 'Messages' }
    ],
    consultant: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/institute', label: 'Institute' },
      { path: '/messages', label: 'Messages' }
    ]
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li key={item.path}>
            <Link to={item.path} className={isActive(item.path)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
