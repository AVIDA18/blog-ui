import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState(null);
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
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (form.website) formData.append('website', form.website);
      if (profileImage) formData.append('profileImage', profileImage);

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5092/api';
      const response = await fetch(`${baseUrl}/Auth/SignUp`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Registration failed');
      }

      navigate('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="page-subtitle">Sign up to start reading and writing.</p>

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
              maxLength={30}
              placeholder="johndoe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
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
          <div className="form-group">
            <label htmlFor="website">Website (optional)</label>
            <input
              id="website"
              name="website"
              type="text"
              className="form-input"
              value={form.website}
              onChange={handleChange}
              maxLength={30}
              placeholder="https://mywebsite.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image (optional)</label>
            <div className="file-input-wrapper">
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
