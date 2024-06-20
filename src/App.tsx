import { useEffect } from 'react';
import './App.css';
import router from './router';
import { RouterProvider } from 'react-router-dom';

function App() {
  useEffect(() =>{
    console.log('init');
    
  }, [])
  return <RouterProvider router={router} />;
}

export default App;
