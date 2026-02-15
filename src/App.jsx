import { Route, Routes } from 'react-router-dom'
import './App.css'
import Nav from './Components/Nav/Nav'
import Home from './Pages/Home'

function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
