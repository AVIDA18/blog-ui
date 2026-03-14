import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const SingleArticle = () => {

    const { slug } = useParams();

    const [singleArticle, setSingleArticle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchSingleBlog = async () => {

            try {
                const response = await fetch(
                    `http://localhost:5092/api/Blog/getBlogsByTitleSlug/${slug}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch single article");
                }

                const result = await response.json();

                setSingleArticle(result);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleBlog();
    }, [slug]);

    const fetchBlogComments = async () => {
        setCommentsLoading(true);
        
        try {
            const response = await fetch(
                `http://localhost:5092/api/BlogComment/${singleArticle.id}/comments`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const result = await response.json();

            setComments(result);
            setShowComments(prev => !prev);
        } catch (err) {
            setCommentsError(err.message);
        } finally {
            setCommentsLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="SingleBlog-container">
                {singleArticle.images.map((p) => (
                    <img
                        src={`http://localhost:5092/${p.imageUrl}`}
                        alt={p.altTxt}
                        className="SingleBlog-image" />
                ))}

                <div>
                    <h4 className="SingleBlog-category">#{singleArticle.blogCategory.categoryName}</h4>
                    <h4 className="SingleBlog-date">{singleArticle.blogDate}</h4>
                    <h1 className="SingleBlog-title">{singleArticle.title}</h1>
                    <h3 className="SingleBlog-author">{singleArticle.actualAuthor ?? singleArticle.author.userName}</h3>
                    <p className="SingleBlog-body">{singleArticle.content}</p>
                </div>
            </div>
            <div className="comment-section">

                <button onClick={fetchBlogComments}>
                    {showComments ? "Hide Comments" : "Load Comments"}
                </button>

                {commentsLoading && <p>Loading comments...</p>}

                {commentsError && <p>Error: {commentsError}</p>}

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
        </>
    );
}

export default SingleArticle
