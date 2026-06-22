import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/api';

const Comment = ({ blogId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api(`/BlogComment/${blogId}/comments`);
      setComments(data || []);
      setShowComments(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to comment.');
      return;
    }
    setSubmitting(true);
    try {
      await api('/BlogComment/AddBlogComment', {
        method: 'POST',
        body: JSON.stringify({ comment: newComment, blogId }),
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const editComment = async (commentId) => {
    setSubmitting(true);
    try {
      await api('/BlogComment/EditBlogComment', {
        method: 'POST',
        body: JSON.stringify({ id: commentId, comment: editText, blogId }),
      });
      setEditingId(null);
      setEditText('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api(`/BlogComment/DeleteBlogComment/${commentId}`, { method: 'DELETE' });
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const canModify = (comment) => {
    return isAuthenticated && (user?.id == comment.userId || user?.role === 'Admin');
  };

  return (
    <div className="comments-section">
      <button className="btn btn-secondary btn-sm" onClick={fetchComments}>
        {showComments ? 'Hide Comments' : `Comments${comments.length ? ` (${comments.length})` : ''}`}
      </button>

      {loading && <div className="spinner" />}
      {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}

      {showComments && !loading && (
        <div style={{ marginTop: 20 }}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{c.user?.userName || 'Unknown'}</span>
                  <span className="comment-date">{c.commentedAt ? new Date(c.commentedAt).toLocaleDateString() : ''}</span>
                </div>

                {editingId === c.id ? (
                  <div>
                    <textarea
                      className="form-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{ minHeight: 60 }}
                    />
                    <div className="comment-form-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => editComment(c.id)} disabled={submitting}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setEditText(''); }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-text">{c.comment}</p>
                    {canModify(c) && (
                      <div className="comment-actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => { setEditingId(c.id); setEditText(c.comment); }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteComment(c.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}

          {isAuthenticated ? (
            <form className="comment-form" onSubmit={addComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !newComment.trim()}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '0.9rem' }}>
              <a href="/login">Log in</a> to leave a comment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
