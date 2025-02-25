import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./core/context/authContext";
import ProtectedRoute from "./components/protectedRoutes";

const queryClient = new QueryClient();

const Home = lazy(() => import("./core/public/home"));
const LoginPage = lazy(() => import("./core/public/login"));
const RegisterSecond = lazy(() => import("./core/public/registerSecond"));
const Register = lazy(() => import("./core/public/register"));
const VerifyOTPPage = lazy(() => import("./core/public/otpVerification"));
const Freelancer = lazy(() => import("./core/public/freelancer"));
const Layout = lazy(() => import("./core/private/admin/Layout"));
const ProjectDetails = lazy(() => import("./core/public/projectDetails"));
const CompanyView = lazy(() => import("./core/public/companyView"));

function App() {
  const { isLoggedIn } = useAuth();
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
    { path: "/", element: <Suspense fallback={<div>Loading...</div>}><Home theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/login", element: <Suspense fallback={<div>Loading...</div>}><LoginPage theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/register", element: <Suspense fallback={<div>Loading...</div>}><Register theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/register-second", element: <Suspense fallback={<div>Loading...</div>}><RegisterSecond theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/verify-otp", element: <Suspense fallback={<div>Loading...</div>}><VerifyOTPPage theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/freelancer/:freelancerId", element: <Suspense fallback={<div>Loading...</div>}><Freelancer theme={theme} toggleTheme={toggleTheme} /></Suspense> },
    { path: "/project-details/:projectId", element: <Suspense fallback={<div>Loading...</div>}><ProjectDetails /></Suspense> },
    { path: "/company-view/:companyId", element: <Suspense fallback={<div>Loading...</div>}><CompanyView theme={theme} toggleTheme={toggleTheme} /></Suspense> },

    {
      path: "/company/:companyId",
      element: <ProtectedRoute requiredRole="company" />,
      children: [
        { path: "", element: <Suspense fallback={<div>Loading...</div>}><Layout theme={theme} toggleTheme={toggleTheme} /></Suspense> }
      ],
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createBrowserRouter(publicRoutes)} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </QueryClientProvider>
  );
}

export default App;
