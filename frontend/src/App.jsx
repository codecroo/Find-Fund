import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";

// Founder Pages
import FounderDashboard from "./pages/founder/FounderDashboard";
import FounderStartups from "./pages/founder/FounderStartups";
// import FounderFunding from "./pages/founder/FundingRequests";
// import FounderMessages from "./pages/founder/Messages";
// import FounderProfile from "./pages/founder/Profile";

// Investor Pages
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import InvestorBrowse from "./pages/investor/BrowseStartups";
// import InvestorSaved from "./pages/investor/SavedStartups";
// import InvestorInvestments from "./pages/investor/Investments";
// import InvestorMessages from "./pages/investor/Messages";
// import InvestorProfile from "./pages/investor/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Founder Routes */}
        <Route
          path="/dashboard/founder"
          element={
            <PrivateRoute allowedRoles={["Founder"]}>
              <FounderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/startups"
          element={
            <PrivateRoute allowedRoles={["Founder"]}>
              <FounderStartups />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/dashboard/founder/funding"
          element={
            <PrivateRoute allowedRoles={["Founder"]}>
            <FounderFunding />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/messages"
          element={
            <PrivateRoute allowedRoles={["Founder"]}>
            <FounderMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/profile"
          element={
            <PrivateRoute allowedRoles={["founder"]}>
            <FounderProfile />
            </PrivateRoute>
          }
        /> */}

        {/* Investor Routes */}
        <Route
          path="/dashboard/investor"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
              <InvestorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/startups"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
              <InvestorBrowse />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/dashboard/investor/saved"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
            <InvestorSaved />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/investments"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
            <InvestorInvestments />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/messages"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
            <InvestorMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/profile"
          element={
            <PrivateRoute allowedRoles={["Investor"]}>
            <InvestorProfile />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
