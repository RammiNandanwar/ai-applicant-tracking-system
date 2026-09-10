import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const MyApplications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "applicant") {
            navigate("/dashboard");
            return;
        }

        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await API.get("/applications/my");

            setApplications(
                response.data.applications || []
            );

        } catch (error) {
            console.error(
                "Error fetching applications:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to load your applications."
            );

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "selected":
                return "status-selected";

            case "rejected":
                return "status-rejected";

            case "interview":
                return "status-interview";

            case "shortlisted":
                return "status-shortlisted";

            default:
                return "status-applied";
        }
    };

    if (loading) {
        return (
            <div className="my-applications-page">
                <div className="application-state">
                    <h2>
                        Loading applications...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="my-applications-page">

            {/* HEADER */}

            <header className="applications-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track the jobs you have applied
                        for.
                    </p>

                </div>

                <button
                    className="browse-button"
                    onClick={() =>
                        navigate("/jobs")
                    }
                >
                    Browse Jobs
                </button>

            </header>


            {/* ERROR */}

            {error && (
                <div className="application-error">
                    {error}
                </div>
            )}


            {/* EMPTY */}

            {!error &&
                applications.length === 0 && (

                    <div className="application-state">

                        <div className="empty-icon">
                            📄
                        </div>

                        <h2>
                            No applications yet
                        </h2>

                        <p>
                            You haven't applied for
                            any jobs yet.
                        </p>

                        <button
                            className="browse-button"
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            Browse Jobs
                        </button>

                    </div>
                )}


            {/* APPLICATIONS */}

            {applications.length > 0 && (

                <div className="applications-list">

                    {applications.map(
                        (application) => {

                            const job =
                                application.job;

                            const score =
                                application.aiAnalysis
                                    ?.matchScore;

                            return (
                                <div
                                    className="application-card"
                                    key={
                                        application._id
                                    }
                                >

                                    <div className="application-main">

                                        <div>

                                            <h2>
                                                {job?.title ||
                                                    "Job"}
                                            </h2>

                                            <p className="company">
                                                {job?.company ||
                                                    "Company"}
                                            </p>

                                        </div>

                                        <span
                                            className={`application-status ${getStatusClass(
                                                application.status
                                            )}`}
                                        >
                                            {application.status}
                                        </span>

                                    </div>


                                    <div className="application-details">

                                        <span>
                                            📍{" "}
                                            {job?.location ||
                                                "Not specified"}
                                        </span>

                                        <span>
                                            📅 Applied
                                        </span>

                                        {score !==
                                            undefined && (
                                            <span>
                                                🤖 AI Score:{" "}
                                                <strong>
                                                    {score}%
                                                </strong>
                                            </span>
                                        )}

                                    </div>


                                    {application.aiAnalysis
                                        ?.summary && (

                                        <div className="analysis-preview">

                                            <h4>
                                                AI Analysis
                                            </h4>

                                            <p>
                                                {
                                                    application
                                                        .aiAnalysis
                                                        .summary
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>
                            );
                        }
                    )}

                </div>
            )}


            <style>{`

                .my-applications-page {
                    min-height: 100vh;
                    padding: 40px;
                    background: #f5f7fb;
                    font-family: Arial, sans-serif;
                }

                .applications-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 35px;
                }

                .applications-header h1 {
                    margin: 12px 0 7px;
                    font-size: 32px;
                }

                .applications-header p {
                    margin: 0;
                    color: #666;
                }

                .back-button {
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 15px;
                }

                .browse-button {
                    border: none;
                    padding: 11px 18px;
                    border-radius: 8px;
                    background: #111827;
                    color: white;
                    cursor: pointer;
                }

                .applications-list {
                    max-width: 1000px;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .application-card {
                    background: white;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow:
                        0 4px 15px
                        rgba(0,0,0,0.06);
                }

                .application-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }

                .application-main h2 {
                    margin: 0 0 5px;
                }

                .company {
                    color: #666;
                    margin: 0;
                }

                .application-status {
                    padding: 7px 13px;
                    border-radius: 20px;
                    font-size: 12px;
                    text-transform: capitalize;
                    font-weight: bold;
                }

                .status-applied {
                    background: #e5e7eb;
                    color: #374151;
                }

                .status-shortlisted {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                .status-interview {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-selected {
                    background: #dcfce7;
                    color: #166534;
                }

                .status-rejected {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .application-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 20px;
                    color: #666;
                    font-size: 14px;
                }

                .analysis-preview {
                    margin-top: 20px;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                .analysis-preview h4 {
                    margin: 0 0 8px;
                }

                .analysis-preview p {
                    color: #555;
                    line-height: 1.5;
                    margin: 0;
                }

                .application-state {
                    max-width: 600px;
                    margin: 80px auto;
                    padding: 45px;
                    background: white;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow:
                        0 4px 15px
                        rgba(0,0,0,0.06);
                }

                .empty-icon {
                    font-size: 45px;
                }

                .application-error {
                    padding: 14px;
                    background: #fee2e2;
                    color: #991b1b;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                @media (max-width: 700px) {

                    .my-applications-page {
                        padding: 20px;
                    }

                    .applications-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .application-main {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                }

            `}</style>

        </div>
    );
};

export default MyApplications;