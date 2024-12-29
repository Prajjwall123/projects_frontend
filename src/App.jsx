import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./core/public/home"));

function App() {
  const publicRoutes = [
    {
      path: "/",
      element: (
        <Suspense>
          <Home />
        </Suspense>
      ),
      errorElement: <>error</>,
    },
    { path: "*", element: <>unauthorized</> },
  ];

  return (
    <RouterProvider router={createBrowserRouter(publicRoutes)} />
  );
}

export default App;
