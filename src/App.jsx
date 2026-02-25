import { Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home/Home'
import Categories from './Pages/Categories/Categories'

function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
      </Routes>
    </>
  )
}

export default App
