import './App.css';
import { createTheme, MantineProvider } from '@mantine/core';
import Header from './components/Header/Header';
import { FooterLinks } from './components/Footer/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';

const theme = createTheme({
  colorScheme: 'dark', // Enables Mantine's dark mode
  colors: {
    // Optionally override the default dark colors
    dark: [
      'rgb(114 113 104)',
      '#121212',
      '#1A1A1A',
      '#1F1F1F',
      '#222222',
      '#2C2C2C',
      '#333333',
      '#3A3A3A',
      '#444444',
      '#555555',
    ],
  },
  fontFamily: 'Inter, sans-serif', // Optional: customize font
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">      
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/about' element={<About />}/>
      </Routes>
      <FooterLinks />
    </MantineProvider>
  );
}

export default App;
