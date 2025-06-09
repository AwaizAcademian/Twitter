import React, { useState, useContext } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './Login.css'; // Make sure this CSS file is created

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <svg viewBox="0 0 24 24" fill="#1DA1F2" width="36" height="36">
              <path d="M23.643 4.937a9.59 9.59 0 0 1-2.828.775 4.93 4.93 0 0 0 2.165-2.723 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.94 13.94 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.574 4.894 4.894 0 0 1-2.229-.616v.06a4.915 4.915 0 0 0 3.946 4.813 4.902 4.902 0 0 1-2.224.084 4.917 4.917 0 0 0 4.588 3.417 9.868 9.868 0 0 1-6.102 2.104c-.395 0-.786-.023-1.17-.069a13.945 13.945 0 0 0 7.548 2.212c9.056 0 14.009-7.506 14.009-14.009 0-.213-.005-.425-.014-.636a10.01 10.01 0 0 0 2.466-2.554z" />
            </svg>
          </div>

          <h5 className="card-title text-center mb-4 text-light">Log in to Twitter</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="username"
                type="text"
                className="form-control form-control-lg input-dark"
                placeholder="Username or email"
                required
                onChange={handleChange}
                value={form.username}
              />
            </div>

            <div className="mb-3">
              <input
                name="password"
                type="password"
                className="form-control form-control-lg input-dark"
                placeholder="Password"
                required
                onChange={handleChange}
                value={form.password}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg w-100 login-btn">
              Log in
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-white">Don’t have an account? </span>
            <button
              className="btn btn-link text-info p-0"
              onClick={() => navigate('/register')}
              style={{ textDecoration: 'none' }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;