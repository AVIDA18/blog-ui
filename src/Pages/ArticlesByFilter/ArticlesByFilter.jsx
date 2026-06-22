import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/api';

const ArticlesByFilter = () => {
  const { filter } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api(`/Blog/getBlogs?page=1&pageSize=50&categorySlug=${filter}`);
        setArticles(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [filter]);

  const truncate = (text, len = 200) => {
    if (!text) return '';
    return text.length > len ? text.substring(0, len) + '...' : text;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const categoryName = articles[0]?.blogCategory?.categoryName || filter;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="page-title">{categoryName}</h1>
        <p className="page-subtitle">Articles in this category.</p>

        {loading && <div className="spinner" />}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <h2>No articles found for this category.</h2>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="blog-grid">
            {articles.map((blog) => (
              <article key={blog.id} className="blog-card">
                {blog.images?.[0] && (
                  <img
                    className="blog-card-image"
                    src={`http://localhost:5092/${blog.images[0].imageUrl}`}
                    alt={blog.images[0].altTxt || blog.title}
                  />
                )}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-card-category">{blog.blogCategory?.categoryName}</span>
                    <span>{formatDate(blog.blogDate)}</span>
                  </div>
                  <h2 className="blog-card-title">
                    <Link to={`/article/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="blog-card-excerpt">{truncate(blog.content)}</p>
                  <div className="blog-card-footer">
                    <span>{blog.actualAuthor || blog.author?.userName || 'Anonymous'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesByFilter;
