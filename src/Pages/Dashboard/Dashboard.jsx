import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/api';
import { useEffect } from 'react';

const TAB_BLOGS = 'blogs';
const TAB_CATEGORIES = 'categories';
const TAB_USERS = 'users';
const TAB_TODOS = 'todos';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? TAB_BLOGS : TAB_TODOS);

  if (!user) return null;

  const tabs = [];
  if (isAdmin) {
    tabs.push({ key: TAB_BLOGS, label: 'Blogs' });
    tabs.push({ key: TAB_CATEGORIES, label: 'Categories' });
    tabs.push({ key: TAB_USERS, label: 'Users' });
  }
  tabs.push({ key: TAB_TODOS, label: 'My Tasks' });

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h3>Dashboard</h3>
        <nav className="dashboard-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-content">
        {activeTab === TAB_BLOGS && isAdmin && <BlogManager />}
        {activeTab === TAB_CATEGORIES && isAdmin && <CategoryManager />}
        {activeTab === TAB_USERS && isAdmin && <UserManager />}
        {activeTab === TAB_TODOS && <ToDoManager />}
      </main>
    </div>
  );
};

/* ===== BLOG MANAGER (Admin) ===== */
const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api('/Blog/getBlogs?page=1&pageSize=100');
      setBlogs(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await api(`/Blog/DeleteBlogs/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const navigate = useNavigate();

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Manage Blogs</h2>
        <button className="btn btn-primary" onClick={() => navigate('/editor/new')}>
          + New Blog
        </button>
      </div>
      {blogs.length === 0 ? (
        <div className="empty-state"><h2>No blogs yet</h2></div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, i) => (
              <tr key={blog.id}>
                <td>{i + 1}</td>
                <td>
                  <Link to={`/article/${blog.slug}`} target="_blank">{blog.title}</Link>
                </td>
                <td>{blog.actualAuthor || blog.author?.userName}</td>
                <td><span className="badge badge-primary">{blog.blogCategory?.categoryName}</span></td>
                <td>{blog.blogDate ? new Date(blog.blogDate).toLocaleDateString() : ''}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/editor/${blog.slug}`)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteBlog(blog.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ===== CATEGORY MANAGER (Admin) ===== */
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ categoryName: '', description: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api('/BlogCategory/listBlogCategories');
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ categoryName: '', description: '' });
    setEditing(null);
  };

  const openEdit = (cat) => {
    setForm({ categoryName: cat.categoryName, description: cat.description });
    setEditing(cat.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api(`/BlogCategory/EditBlogCategory/${editing}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await api('/BlogCategory/addBlogCategory', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      resetForm();
      setSuccessMsg(editing ? 'Category updated!' : 'Category created!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api(`/BlogCategory/DeleteBlogCategory/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Manage Categories</h2>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: 'var(--bg-alt)', padding: 20, borderRadius: 'var(--radius)' }}>
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>{editing ? 'Edit Category' : 'Add New Category'}</h3>
        <div className="form-group">
          <label>Category Name</label>
          <input className="form-input" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} required placeholder="e.g. Technology" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Brief description of this category" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary btn-sm">
            {editing ? 'Update Category' : 'Create Category'}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat.id}>
                <td>{i + 1}</td>
              <td><strong>{cat.categoryName}</strong></td>
              <td><code>{cat.slug}</code></td>
              <td>{cat.description}</td>
              <td>
                <div className="table-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(cat)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ===== USER MANAGER (Admin) ===== */
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api('/User/getUsers');
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId) => {
    try {
      await api('/User/ModifyUserRole', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Manage Users</h2>
      </div>
      <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
              <td><strong>{u.userName}</strong></td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role === 'Admin' ? 'badge-primary' : 'badge-warning'}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-secondary" onClick={() => toggleRole(u.id)}>
                  Toggle Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ===== TODO MANAGER (Authenticated) ===== */
const ToDoManager = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editDate, setEditDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api('/ToDo/ToDoLists');
      setTodos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setSubmitting(true);
    try {
      await api('/ToDo/AddToDoTask', {
        method: 'POST',
        body: JSON.stringify({ task: newTask, taskAssignedForDateTime: newDate }),
      });
      setNewTask('');
      setNewDate(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
      fetchTodos();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const editTodo = async (id) => {
    if (!editTask.trim()) return;
    setSubmitting(true);
    try {
      await api(`/ToDo/EditToDoTask?taskId=${id}`, {
        method: 'POST',
        body: JSON.stringify({ task: editTask, taskAssignedForDateTime: editDate }),
      });
      setEditingId(null);
      fetchTodos();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const completeTodo = async (id) => {
    try {
      await api('/ToDo/CompleteToDoTask', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api('/ToDo/DeleteToDoTask', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      fetchTodos();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Tasks</h2>
      </div>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          className="form-input"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
          style={{ flex: 2, minWidth: 200 }}
        />
        <input
          type="datetime-local"
          className="form-input"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          required
          style={{ flex: 1, minWidth: 180 }}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          Add Task
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="empty-state"><h2>No tasks yet</h2><p>Add your first task above.</p></div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo.id} className={`todo-item${todo.isCompleted ? ' completed' : ''}`}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.isCompleted}
                onChange={() => completeTodo(todo.id)}
              />

              {editingId === todo.id ? (
                <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    className="form-input"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    style={{ flex: 2, minWidth: 150 }}
                  />
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={{ flex: 1, minWidth: 150 }}
                  />
                  <button className="btn btn-sm btn-primary" onClick={() => editTodo(todo.id)} disabled={submitting}>
                    Save
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <div className="todo-text">{todo.task}</div>
                    <div className="todo-date">{todo.taskAssignedForDateTime ? formatDate(todo.taskAssignedForDateTime) : ''}</div>
                  </div>
                  <div className="todo-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => {
                      setEditingId(todo.id);
                      setEditTask(todo.task);
                      setEditDate(todo.taskAssignedForDateTime?.slice(0, 16) || '');
                    }}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
