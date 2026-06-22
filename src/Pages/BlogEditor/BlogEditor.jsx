import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/api';

const BlogEditor = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const isEditing = slug && slug !== 'new';

  const [form, setForm] = useState({
    title: '',
    content: '',
    blogDate: new Date().toISOString().slice(0, 16),
    actualAuthor: '',
    source: '',
    blogCategoryId: '',
  });
  const [blogId, setBlogId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let cats = [];
      try {
        cats = await api('/BlogCategory/listBlogCategories');
        setCategories(cats || []);
      } catch {
        /* ignore */
      }

      if (isEditing) {
        try {
          const blog = await api(`/Blog/getBlogsByTitleSlug/${slug}`);
          setBlogId(blog.id);
          const categoryName = blog.category?.categoryName || blog.blogCategory?.categoryName || '';
          const matched = (cats || []).find((c) => c.categoryName === categoryName);
          setForm({
            title: blog.title || '',
            content: blog.content || '',
            blogDate: blog.blogDate ? blog.blogDate.slice(0, 16) : '',
            actualAuthor: blog.actualAuthor || '',
            source: blog.source || '',
            blogCategoryId: matched ? String(matched.id) : '',
          });
          setExistingImages(blog.images || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [slug, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('blogDate', form.blogDate);
      if (form.actualAuthor) formData.append('actualAuthor', form.actualAuthor);
      if (form.source) formData.append('source', form.source);
      if (form.blogCategoryId) formData.append('blogCategoryId', form.blogCategoryId);
      images.forEach((img) => formData.append('images', img));

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5092/api';
      const token = localStorage.getItem('token');

      if (isEditing) {
        const response = await fetch(`${baseUrl}/Blog/EditBlogs/${blogId}`, {
          method: 'PUT',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!response.ok) throw new Error(await response.text() || 'Failed to update blog');
      } else {
        const response = await fetch(`${baseUrl}/Blog/postBlogs`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!response.ok) throw new Error(await response.text() || 'Failed to create blog');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="editor-page">
      <h1>{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={600}
          />
        </div>

        <div className="form-group">
          <label htmlFor="blogCategoryId">Category</label>
          <select
            id="blogCategoryId"
            name="blogCategoryId"
            className="form-input"
            value={form.blogCategoryId}
            onChange={handleChange}
            required
          >
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.categoryName}</option>
              ))}
          </select>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="blogDate">Blog Date *</label>
            <input
              id="blogDate"
              name="blogDate"
              type="datetime-local"
              className="form-input"
              value={form.blogDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="source">Source</label>
            <input
              id="source"
              name="source"
              className="form-input"
              value={form.source}
              onChange={handleChange}
              placeholder="Original source URL"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="actualAuthor">Actual Author (override)</label>
          <input
            id="actualAuthor"
            name="actualAuthor"
            className="form-input"
            value={form.actualAuthor}
            onChange={handleChange}
            placeholder="Leave blank to use your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            className="form-input"
            value={form.content}
            onChange={handleChange}
            required
            rows={15}
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="form-group">
          <label>Images</label>
          {existingImages.length > 0 && (
            <div className="editor-image-preview">
              {existingImages.map((img, i) => (
                <img key={i} src={`http://localhost:5092/${img.imageUrl}`} alt={img.altTxt || ''} />
              ))}
            </div>
          )}
          <div className="file-input-wrapper" style={{ marginTop: 8 }}>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
            />
          </div>
          {images.length > 0 && (
            <div className="editor-image-preview">
              {images.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="" />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Update Blog' : 'Publish Blog'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
