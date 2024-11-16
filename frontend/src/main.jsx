import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//specified element here
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/auth"
      },
      {
        path:"/user-space"
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);