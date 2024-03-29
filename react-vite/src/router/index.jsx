import { Outlet, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { HomePage } from '../components/HomePage/HomePage';
import { VanList } from '../components/Vans/VanList/VanList';
import { VanDetail } from '../components/Vans/VanDetail/VanDetail';
import { CreateVan } from '../components/Vans/CreateVan/CreateVan';
import { ManageVans } from '../components/Vans/ManageVans/ManageVans';
import { ManageRatings } from '../components/Ratings/ManageRatings/ManageRatings';
import { UpdateVan } from '../components/Vans/UpdateVan/UpdateVan';
import { Favorites } from '../components/Favorites/Favorites';
import { Errors } from '../components/Errors/Errors';
import { VanListProvider } from '../context/VanListContext';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <Errors />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "account",
        element: <h1>Feature coming soon!</h1>
      },
      {
        path: "notifications",
        element: <h1>Feature coming soon!</h1>
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
        path: "trips",
        element: <h1>Feature coming soon!</h1>
      },
      {
        path: "vans",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: 
              <VanList />,
          },
          {
            path: ":vanId",
            element: <Outlet />,
            loader: async ({params}) => {
              if (!Number(params.vanId)) {
                throw new Response(`${params.vanId} is not a valid identifier`, {status: 400})
              }

              const response = await fetch(`/api/vans/${params.vanId}`)

              if (response.status === 404) {
                throw new Response("This van doesn't exist", { status: 404 })
              }

              if (response.status === 500) {
                throw new Response(`${params.vanId} is not a valid identifier`, {status: 500})
              }

              const page = await response.json()
              return page
            },
            children: [
              {
                index: true,
                element: <VanDetail />,
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
      {
        path: "users",
        element: <Outlet />,
        children: [
          {
            path: ":userId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <h1>Feature coming soon!</h1>
              },
              {
                path: "favorites",
                element: <Favorites />
              }
            ]
          }
        ]
      },
      // {
      //   path: "*",
      //   element: <Errors />
      // }
    ],
  },
]);