
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-100">
            <AppRoutes />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;