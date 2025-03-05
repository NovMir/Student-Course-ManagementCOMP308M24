import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Handle login logic here
      const { data } = await axios.post('/users/login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      // Redirect to Students page
   if (data.role === 'admin') {
        navigate('/admin');
      } else { navigate('/students'); }
    } catch (error) {
      console.error(error);
      setError('Invalid email or password');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;



  