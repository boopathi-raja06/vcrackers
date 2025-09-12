import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-red-700">Admin Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input type="text" placeholder="Username" className="mb-4 p-2 border rounded w-full" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="mb-6 p-2 border rounded w-full" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
