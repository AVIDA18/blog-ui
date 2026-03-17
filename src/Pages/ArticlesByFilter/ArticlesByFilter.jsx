import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ArticlesByFilter = () => {

    const {filter} = useParams();

    const [articlesByFilter, setArticlesByFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticlesByFilter = async () => {
            try {
                const response = await fetch(`http://localhost:5092/api/Blog/getBlogs?page=1&pageSize=10&categorySlug=${filter}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch articles.");
                }

                const result = await response.json();

                setArticlesByFilter(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticlesByFilter();

    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="Blogs-container">

            {articlesByFilter.data.length === 0 ? (
                <h1>No articles found for this category.</h1>
            ) : (
                <>
                    <h1>#{articlesByFilter.data[0].blogCategory.categoryName}</h1>
                    {articlesByFilter.data.map((p) => (
                        <div key={p.id} className="Blogs-card">
                            <h3 className="Blogs-title"> <Link to={`/article/${p.slug}`}>{p.title}</Link></h3>
                            <h3 className="Blogs-author">{p.actualAuthor ?? p.author.userName}</h3>
                            <h3 className="Blogs-date">{p.blogDate}</h3>
                            <h3 className="Blogs-category">{p.blogCategory.categoryName}</h3>
                            <p className="Blogs-body">{p.content}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default ArticlesByFilter
