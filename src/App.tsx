import DashBoard from "./components/DashBoard";
import LogIn from "./components/LogIn";
import { createBrowserRouter, RouterProvider } from "react-router";
import Products from "./components/Products";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <LogIn />
        </>
      ),
    },
    {
      path: "/products",
      element: (
        <>
          <Products />
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <DashBoard />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
