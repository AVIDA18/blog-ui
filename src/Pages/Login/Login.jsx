import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api('/Auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="page-subtitle">Log in to your account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="johndoe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
