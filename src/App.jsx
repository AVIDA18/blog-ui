import { Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Categories from './Pages/Categories/Categories';
import SingleArticle from './Pages/SingleArticle/SingleArticle';
import ArticlesByFilter from './Pages/ArticlesByFilter/ArticlesByFilter';
import Search from './Components/Search/Search';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail';
import Dashboard from './Pages/Dashboard/Dashboard';
import BlogEditor from './Pages/BlogEditor/BlogEditor';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/article/:slug" element={<SingleArticle />} />
        <Route path="/categories/:filter" element={<ArticlesByFilter />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute adminOnly>
              <BlogEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
