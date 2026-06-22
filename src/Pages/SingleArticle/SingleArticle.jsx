import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/api';
import Comment from '../../Components/Comment/Comment';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Carousel from '../../Components/Carousel/Carousel';

const SingleArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api(`/Blog/getBlogsByTitleSlug/${slug}`);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="spinner" />;
  if (error) return <div className="page-wrapper"><div className="container"><div className="alert alert-error">{error}</div></div></div>;
  if (!article) return <div className="page-wrapper"><div className="container"><div className="empty-state"><h2>Article not found</h2></div></div></div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="article-header">
          {article.images?.length > 0 && (
            <Carousel images={article.images} alt={article.title} />
          )}

          <div className="article-meta">
            {article.category && (
              <Link to={`/categories/${article.category.slug}`} className="article-category">
                {article.category.categoryName}
              </Link>
            )}
            <span className="article-date">{formatDate(article.blogDate)}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-author">
            by <strong>{article.actualAuthor || article.users?.userName || 'Anonymous'}</strong>
          </div>
          {article.source && <div className="article-source">Source: {article.source}</div>}

          <div className="article-actions">
            <LikeButton blogId={article.id} />
          </div>
        </div>

        <div className="article-content">
          {article.content?.split('\n').map((paragraph, i) => (
            paragraph.trim() ? <p key={i}>{paragraph}</p> : null
          ))}
        </div>

        <Comment blogId={article.id} />
      </div>
    </div>
  );
};

export default SingleArticle;
