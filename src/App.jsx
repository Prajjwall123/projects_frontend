import { lazy, Suspense, useEffect, useState } from "react";
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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const publicRoutes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPage theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading login page</div>,
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Register theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading register page</div>,
    },
    {
      path: "/register-second",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterSecond theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading register page</div>,
    },
    {
      path: "/verify-otp",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOTPPage theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading verify OTP page</div>,
    },
    {
      path: "/freelancer",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Freelancer theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading freelancer profile page</div>,
    },
    {
      path: "/company",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Company theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading company profile page</div>,
    },
    {
      path: "/project-details",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDetails theme={theme} toggleTheme={toggleTheme} />
        </Suspense>
      ),
      errorElement: <div>Error loading project details page</div>,
    },
  ];

  return <RouterProvider router={createBrowserRouter(publicRoutes)} />;
}

export default App;
