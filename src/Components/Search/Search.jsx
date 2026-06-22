import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api(`/Blog/searchBlogs?searchTerm=${encodeURIComponent(query)}`);
        setResults(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <h2>Search Blogs</h2>
            <p>Use the search bar above to find articles.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Search Results</h1>
        <p className="page-subtitle">Showing results for &quot;{query}&quot;</p>

        {loading && <div className="spinner" />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && results.length === 0 && (
          <div className="empty-state">
            <h2>No results found</h2>
            <p>Try a different search term.</p>
          </div>
        )}

        <div className="search-results">
          {results.map((blog) => (
            <div key={blog.id} className="search-result-item">
              <h3><Link to={`/article/${blog.slug}`}>{blog.title}</Link></h3>
              <p>
                {blog.content?.substring(0, 200)}
                {(blog.content?.length || 0) > 200 ? '...' : ''}
              </p>
              <div className="blog-card-footer">
                <span>{blog.blogDate}</span>
                <span>{blog.actualAuthor || blog.author?.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
