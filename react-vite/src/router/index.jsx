import { Outlet, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { HomePage } from '../components/HomePage/HomePAge';
import { VanList } from '../components/Vans/VanList/VanList';
import { VanDetail } from '../components/Vans/VanDetail/VanDetail';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "vans",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <VanList />
          },
          {
            path: ":vanId",
            element: <VanDetail />
          }
        ]
      },
    ],
  },
]);