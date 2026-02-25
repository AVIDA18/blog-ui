import React, { useEffect, useState } from 'react'

function Categories() {

    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>{
        const fetchCategories = async() => {
            try{
                const response = await fetch(
                    "http://localhost:5092/api/BlogCategory/listBlogCategories"
                );

                if(!response.ok){
                    throw new Error("Failed to fetch blog categories")
                }

                const result = await response.json();

                setBlogCategories(result);
            }
            catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };

        fetchCategories();
    },[]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
    <div className='Categories-container'>
        {blogCategories.map((c)=>(
            <div key={c.id} className='Categories-card'>
                <h2 className='Category-id'>#{c.id}</h2>
                <h3 className='Category-name'>{c.categoryName}</h3>
                <p className='Category-description'>{c.description}</p>
            </div>
        ))}

    </div>
  )
}

export default Categories