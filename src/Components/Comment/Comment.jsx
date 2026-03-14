import React, { useEffect, useState } from 'react'

const Comment = (props) => {

    console.log(blogId);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [blogId, setBlogId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBlogComments = async () => {
        setBlogId(props.blogId);
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:5092/api/BlogComment/${blogId}/comments`
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
    }

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
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <h5>{comment.userName}</h5>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    )
}

export default Comment
