import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import Navbar from "./Components/MPComponents/Navbar";
import Footer from "./Components/MPComponents/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ROUTES } from "./constants";
import ErrorBoundary from "./Components/shared/ErrorBoundary";

// Lazy load page components for better performance
const Home = lazy(() => import("./Components/pages/Home"));
const About = lazy(() => import("./Components/pages/About"));
const Contact = lazy(() => import("./Components/pages/Contact"));
const Donator = lazy(() => import("./Components/pages/Donator"));
const Reward = lazy(() => import("./Components/pages/Reward"));
const Profile = lazy(() => import("./Components/pages/Profile"));
const Receiver = lazy(() => import("./Components/pages/Receiver"));
const Login = lazy(() => import("./Components/pages/Login"));
const Registration = lazy(() => import("./Components/pages/Registration"));
const Foodbank = lazy(() => import("./Components/pages/Foodbank"));
const Logout = lazy(() => import("./Components/pages/Logout"));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="loading-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1.2rem',
  }}>
    <div>Loading...</div>
  </div>
);

function AppContent(): JSX.Element {
  const { user, login, logout } = useAuth();
  const loggedInUser = user?.email || "";

  const setLoggedinUser = (email: string): void => {
    if (email) {
      const token = sessionStorage.getItem('jwt') || '';
      login(email, token);
    } else {
      logout();
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar loggedInUser={loggedInUser} />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home loggedInUser={loggedInUser} />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route
            path={ROUTES.DONATOR}
            element={<Donator setLoggedinUser={setLoggedinUser} />}
          />
          <Route
            path={ROUTES.REWARDS}
            element={<Reward setLoggedinUser={setLoggedinUser} />}
          />
          <Route
            path={ROUTES.PROFILE}
            element={<Profile setLoggedinUser={setLoggedinUser} />}
          />
          <Route path={ROUTES.RECEIVER} element={<Receiver />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route
            path={ROUTES.LOGIN}
            element={<Login setLoggedinUser={setLoggedinUser} />}
          />
          <Route path={ROUTES.REGISTER} element={<Registration />} />
          <Route path={ROUTES.FOODBANK} element={<Foodbank />} />
          <Route 
            path={ROUTES.LOGOUT}
            element={<Logout setLoggedinUser={setLoggedinUser} />}
          />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
