import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./core/context/authContext";
import Register from "./core/public/register";
const Home = lazy(() => import("./core/public/home"));
const LoginPage = lazy(() => import("./core/public/login"));
const RegisterSecond = lazy(() => import("./core/public/registerSecond"));
const VerifyOTPPage = lazy(() => import("./core/public/otpVerification"));
const Freelancer = lazy(() => import("./core/public/freelancer"));
const Company = lazy(() => import("./core/public/company"));
const ProjectDetails = lazy(() => import("./core/public/projectDetails"));


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
    {
      path: "/freelancer",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Freelancer />
        </Suspense>
      ),
      errorElement: <div>Error loading freelancer profile page</div>,
    },
    {
      path: "/company",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Company />
        </Suspense>
      ),
      errorElement: <div>Error loading company profile page</div>,
    },
    {
      path: "/project-details",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDetails />
        </Suspense>
      ),
      errorElement: <div>Error loading company profile page</div>,
    },
  ];

  return (
    <RouterProvider router={createBrowserRouter(publicRoutes)} />
  );
}

export default App;
