import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [Blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5092/api/Blog/getBlogs?page=1&pageSize=10"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch Blogs");
                }

                const result = await response.json();
                
                setBlogs(result);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="Blogs-container">
            {Blogs.data.length === 0 ? (
                <h1>No articles found.</h1>
            ) : (
                <>
                    {Blogs.data.map((p) => (
                        <div key={p.id} className="Blogs-card">
                            <h2 className="Blogs-id">#{p.id}</h2>
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

export default Home;
