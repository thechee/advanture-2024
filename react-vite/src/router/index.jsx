import { Outlet, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import { HomePage } from '../components/HomePage/HomePage';
import { VanList } from '../components/Vans/VanList/VanList';
import { VanDetail } from '../components/Vans/VanDetail/VanDetail';
// import { CreateVan } from '../components/Vans/CreateVan/CreateVan';
// import { UpdateVan } from '../components/Vans/UpdateVan/UpdateVan';
import { Favorites } from '../components/Users/Favorites/Favorites';
import { Errors } from '../components/Errors/Errors';
import { Profile } from '../components/Users/Profile/Profile';
import { VanForm } from '../components/Vans/VanForms/VanForm';
import { VanFormProvider } from '../context/VanFormContext';


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
        path: "trips",
        element: <h1>Feature coming soon!</h1>
      },
      {
        path: "vans",
        element: 
        <VanFormProvider>
          <Outlet />
        </VanFormProvider>,
        children: [
          {
            index: true,
            element: <VanList />
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
                element: <VanForm type={"update"}/>
              }
            ]
          },
          {
            path: "new",
            element: <VanForm />
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
                element: <Profile />
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