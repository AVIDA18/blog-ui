import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/api';

const LikeButton = ({ blogId }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  const fetchLikes = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api(`/BlogLike/${blogId}/Likes`);
      setCount(data?.length || 0);
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserLiked(data?.some((l) => l.userId == payload.id) || false);
      }
    } catch {
      /* ignore */
    }
  }, [blogId, isAuthenticated]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like posts.');
      return;
    }
    setLoading(true);
    try {
      if (userLiked) {
        await api(`/BlogLike/RemoveBlogLike/${blogId}`, { method: 'DELETE' });
        setUserLiked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await api('/BlogLike/AddBlogLike', {
          method: 'POST',
          body: JSON.stringify({ blogId, like: true }),
        });
        setUserLiked(true);
        setCount((c) => c + 1);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-btn${userLiked ? ' liked' : ''}`}
      onClick={toggleLike}
      disabled={loading}
    >
      <span className="like-icon">{userLiked ? '❤️' : '🤍'}</span>
      <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
};

export default LikeButton;
