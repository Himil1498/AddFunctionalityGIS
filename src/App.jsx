// src/App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "./redux/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginBox from "./components/1.LoginPage/1.1 LoginBoxMain";
import Dashboard from "./components/3.DashboardPage/3.0 DashboardMain";
import Network from "./components/4.NetworkPage/4.0 NetworkMain";
import Administration from "./components/5.AdministrationPage/5.0 AdministrationMain";
import Layout from "./components/2.NavbarPage/2.0 Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import AllToolContainer from "./components/4.NetworkPage/4.1 AllToolContainer/4.1 AllToolContainerMain";
import GISToolInterface from "./components/4.NetworkPage/4.1 AllToolContainer/GISToolInterface";
import AllToolCard from "./components/AllTooCard";
import AllTools from "./components/AllTools";
import WorkingMeasurementMap from "./components/WorkingMeasurementMap";
import QuickMapAccess from "./components/QuickMapAccess";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginBox />} />

      {/* Protected routes inside Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/network"
        element={
          <ProtectedRoute>
            <Layout>
              <Network />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/network/allToolContainer"
        element={
          <ProtectedRoute>
            <AllToolContainer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administration"
        element={
          <ProtectedRoute>
            <Layout>
              <Administration />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gisToolInterface"
        element={
          <ProtectedRoute>
            <GISToolInterface />
          </ProtectedRoute>
        }
      />
      <Route
        path="/allToolCard"
        element={
          <Layout>
            <AllToolCard />
          </Layout>
        }
      />
      <Route
        path="/allTools"
        element={
          <Layout>
            <AllTools />
          </Layout>
        }
      />
      
      <Route
        path="/workingMap"
        element={
          <ProtectedRoute>
            <WorkingMeasurementMap />
          </ProtectedRoute>
        }
      />


      {/* Catch-all → redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
    {/* Floating Quick Access to Map Tools */}
    <QuickMapAccess />
    </>
  );
}
