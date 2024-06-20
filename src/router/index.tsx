import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home'
import ChildPage from '@/Pages/ChildPage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path:'/chat',
    element: <ChildPage />
  }
]);
export default router;
