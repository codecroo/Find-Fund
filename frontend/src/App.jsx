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
// import InvestorBrowse from "./pages/investor/BrowseStartups";
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
            <PrivateRoute>
              <FounderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/startups"
          element={
            <PrivateRoute>
              <FounderStartups />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/dashboard/founder/funding"
          element={
            <PrivateRoute>
              <FounderFunding />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/messages"
          element={
            <PrivateRoute>
              <FounderMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/founder/profile"
          element={
            <PrivateRoute>
              <FounderProfile />
            </PrivateRoute>
          }
        /> */}

        {/* Investor Routes */}
        <Route
          path="/dashboard/investor"
          element={
            <PrivateRoute>
              <InvestorDashboard />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/dashboard/investor/startups"
          element={
            <PrivateRoute>
              <InvestorBrowse />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/saved"
          element={
            <PrivateRoute>
              <InvestorSaved />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/investments"
          element={
            <PrivateRoute>
              <InvestorInvestments />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/messages"
          element={
            <PrivateRoute>
              <InvestorMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/investor/profile"
          element={
            <PrivateRoute>
              <InvestorProfile />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
