import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { isUserLoggedIn } from "./core/utils/authHelpers";
import { useAuth } from "./core/context/authContext";
import Register from "./core/public/register";
// import FreelancerRegistration from "./core/public/freelancer";

const Home = lazy(() => import("./core/public/home"));
const LoginPage = lazy(() => import("./core/public/login"));
const RegisterSecond = lazy(() => import("./core/public/registerSecond"));
const VerifyOTPPage = lazy(() => import("./core/public/otpVerification"));

function App() {
  const { isUserLoggedIn, isAdmin } = useAuth();

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
          <Register />
        </Suspense>
      ),
      errorElement: <div>Error loading register page</div>,
    },
    {
      path: "/register-second",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterSecond />
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
