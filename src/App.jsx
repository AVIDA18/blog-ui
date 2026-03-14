import { Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home/Home'
import Categories from './Pages/Categories/Categories'
import SingleArticle from './Pages/SingleArticle/SingleArticle'
import ArticlesByFilter from './Pages/ArticlesByFilter/ArticlesByFilter'

function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/articlesByFilters' element={<ArticlesByFilter/>}/>
        <Route path='/article/:slug' element={<SingleArticle/>}/>
        <Route path='/articleFilter/:filterName' element={<ArticlesByFilter/>}/>
      </Routes>
    </>
  )
}

export default App
