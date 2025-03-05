// pages/Home.jsx

import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Welcome to My App</h1>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.</p>
    </div>
  );
}

export default Home;
