import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ITSpend from "./pages/ITSpend";
import AIInsights from "./pages/AIInsights";
import ConnectGithub from "./pages/ConnectGithub";
import Connections from "./pages/Connections";
import CIMetrices from "./pages/CIMetrics";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/it-spend"
        element={
          <ProtectedRoute>
            <ITSpend />
          </ProtectedRoute>
        }
        />
        
        <Route
        path="/ci-metrices"
        element={
          <ProtectedRoute>
            <CIMetrices />
          </ProtectedRoute>
        }
        />

        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/connect-github" element={<ConnectGithub />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


