import { Outlet, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { HomePage } from '../components/HomePage/HomePage';
import { VanList } from '../components/Vans/VanList/VanList';
import { VanDetail } from '../components/Vans/VanDetail/VanDetail';
import { CreateVan } from '../components/Vans/CreateVan/CreateVan';
import { ManageVans } from '../components/Vans/ManageVans/ManageVans';
import { ManageRatings } from '../components/Ratings/ManageRatings/ManageRatings';
import { UpdateVan } from '../components/Vans/UpdateVan/UpdateVan';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "reviews",
        element: <Outlet />,
        children: [
          {
            path: "manage",
            element: <ManageRatings />
          },
        ]
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
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <VanDetail />
              },
              {
                path: "update",
                element: <UpdateVan />
              }
            ]
          },
          {
            path: "manage",
            element: <ManageVans />
          },
          {
            path: "new",
            element: <CreateVan />
          },
        ]
      },
    ],
  },
]);