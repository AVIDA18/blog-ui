import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="hero">
      <h1>Welcome to Avida Creates</h1>
      <p>Discover stories, ideas, and expertise from writers on any topic.</p>
      <form className="hero-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </section>
  );
};

export default Header;
