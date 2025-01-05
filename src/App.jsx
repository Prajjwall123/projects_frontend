import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./core/public/home"));
const LoginPage = lazy(() => import("./core/public/login"));

function App() {
  const publicRoutes = [
    {
      path: "/",
      element: (
        <Suspense>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense>
          <LoginPage />
        </Suspense>
      ),
      errorElement: <>error</>,
    },
  ];

  return (
    <RouterProvider router={createBrowserRouter(publicRoutes)} />
  );
}

export default App;
