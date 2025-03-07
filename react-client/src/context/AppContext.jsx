import  { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const value = {
    courses,
    setCourses,
    students,
    setStudents,
    loading,
    setLoading,
    error,
    setError,
    notification,
    showNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};
