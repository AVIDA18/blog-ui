import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/api';
import Header from '../../Components/Header/Header';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api(`/Blog/getBlogs?page=${page}&pageSize=${pageSize}`);
        setBlogs(result.data || []);
        setTotalPages(result.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  const truncate = (text, len = 150) => {
    if (!text) return '';
    return text.length > len ? text.substring(0, len) + '...' : text;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div className="container">
          {loading && <div className="spinner" />}
          {error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && blogs.length === 0 && (
            <div className="empty-state">
              <h2>No articles yet</h2>
              <p>Check back later for new content.</p>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <>
              <div className="blog-grid">
                {blogs.map((blog) => (
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
                        {blog.blogCategory && (
                          <Link to={`/categories/${blog.blogCategory.slug}`} className="blog-card-category">
                            {blog.blogCategory.categoryName}
                          </Link>
                        )}
                        <span>{formatDate(blog.blogDate)}</span>
                      </div>
                      <h2 className="blog-card-title">
                        <Link to={`/article/${blog.slug}`}>{blog.title}</Link>
                      </h2>
                      <p className="blog-card-excerpt">{truncate(blog.content)}</p>
                      <div className="blog-card-footer">
                        <span className="footer-author">{blog.actualAuthor || blog.author?.userName || 'Anonymous'}</span>
                        {blog.source && <><span className="footer-divider"></span><span className="footer-source">{blog.source}</span></>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={page === pageNum ? 'active' : ''}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
