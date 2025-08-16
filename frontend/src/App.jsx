import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import FounderDashboard from "./pages/FounderDadhboard";
import InvestorDashboard from "./pages/InvestorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/founder" element={<PrivateRoute><FounderDashboard /></PrivateRoute>} />
        <Route path="/dashboard/investor" element={<PrivateRoute> <InvestorDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;