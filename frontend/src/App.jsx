import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./pages/JobBoard";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import CandidateRanking from "./pages/CandidateRanking";
import MyApplications from "./pages/MyApplications";
import ApplicationPipeline from "./pages/ApplicationPipeline";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/jobs"
                    element={<JobBoard />}
                />

                <Route
                    path="/jobs/:id"
                    element={<JobDetails />}
                />

                {/* Protected Routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/applications"
                        element={<MyApplications />}
                    />

                    <Route
                        path="/jobs/:id/apply"
                        element={<ApplyJob />}
                    />

                    <Route
                        path="/recruiter/jobs/:jobId/candidates"
                        element={
                            <CandidateRanking />
                        }
                    />

                    <Route
                        path="/recruiter/jobs/:jobId/pipeline"
                        element={
                            <ApplicationPipeline />
                        }
                    />

                </Route>

                {/* Unknown URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;