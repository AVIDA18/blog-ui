import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api('/BlogCategory/listBlogCategories');
        setCategories(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Browse articles by topic.</p>

        {loading && <div className="spinner" />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && categories.length === 0 && (
          <div className="empty-state">
            <h2>No categories yet</h2>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="categories-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <h3><Link to={`/categories/${cat.slug}`}>{cat.categoryName}</Link></h3>
                <p>{cat.description}</p>
                <span className="category-count">View Articles →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
