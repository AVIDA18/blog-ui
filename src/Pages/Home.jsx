import { useEffect, useState } from "react";

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
                    throw new Error("Failed to fetch Blogss");
                }

                const result = await response.json();
                
                setBlogs(result.data);

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
        <div className="Blogss-container">
            {Blogs.map((p) => (
                <div key={p.id} className="Blogs-card">
                    <span className="Blogs-id">#{p.id}</span>
                    <h3 className="Blogs-title">{p.title}</h3>
                    <h3 className="Blogs-date">{p.blogDate}</h3>
                    <p className="Blogs-body">{p.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;
