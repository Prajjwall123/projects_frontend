import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("./core/public/home"));
const LoginPage = lazy(() => import("./core/public/login"));
const RegisterPage = lazy(() => import("./core/public/register"));
const VerifyOTPPage = lazy(() => import("./core/public/otpVerification"));

function App() {
  const publicRoutes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPage />
        </Suspense>
      ),
      errorElement: <div>Error loading login page</div>,
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterPage />
        </Suspense>
      ),
      errorElement: <div>Error loading register page</div>,
    },
    {
      path: "/verify-otp",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOTPPage />
        </Suspense>
      ),
      errorElement: <div>Error loading verify OTP page</div>,
    },
  ];

  return (
    <RouterProvider router={createBrowserRouter(publicRoutes)} />
  );
}

export default App;
