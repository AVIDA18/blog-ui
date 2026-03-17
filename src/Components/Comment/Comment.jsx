import React, { useEffect, useState } from 'react'

const Comment = (props) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newComment, setNewComment] = useState('');

    const fetchBlogComments = async () => {
        setLoading(true);
        setNewComment('');

        try {
            const response = await fetch(
                `http://localhost:5092/api/BlogComment/${props.blogId}/comments`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const result = await response.json();

            setComments(result);
            setShowComments(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addBlogComment = async (e) => {

        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:5092/api/BlogComment/AddBlogComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer aeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NzM3NjMwODMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTA5MiIsImF1ZCI6IkJsb2dBcGlVc2VycyJ9.5k9KJx5L6zxIGKN-vtsBGSnhrN9u95sHTl-cfEmdVX4`
                },
                body: JSON.stringify({
                    comment: newComment,
                    blogId: props.blogId
                })
            }
            );

            if (response.status === 401) {
                alert("Please Log In to comment.")
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to post a comment.")
            }

            fetchBlogComments();

        }
        catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="comment-section">

            <button onClick={fetchBlogComments}>
                {showComments ? "Comments" : "Load Comments"}
            </button>

            {showComments && (
                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p>No comments yet</p>
                    ) : (
                        comments.map((c) => (
                            <div>
                                <h5>{c.user.userName}</h5>
                                <p>{c.comment}</p>
                                <p>{c.commentedAt}</p>
                            </div>
                        ))
                    )}
                    <form onSubmit={addBlogComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Comment Here..."
                            required
                        />

                        <button type="submit">Add Comment</button>
                    </form>
                </div>
            )}

        </div>
    )
}

export default Comment
