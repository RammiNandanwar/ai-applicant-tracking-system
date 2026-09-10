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

            const response = await API.get("/applications/my");

            setApplications(response.data.applications || []);
        } catch (error) {
            console.error("Error fetching applications:", error);

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
                    <h2>Loading applications...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="my-applications-page">

            <header className="applications-header">

                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <h1>My Applications</h1>

                    <p>
                        Track the jobs you have applied for.
                    </p>
                </div>

                <button
                    className="browse-button"
                    onClick={() => navigate("/jobs")}
                >
                    Browse Jobs
                </button>

            </header>

            {error && (
                <div className="application-error">
                    {error}
                </div>
            )}

            {!error && applications.length === 0 && (
                <div className="application-state">

                    <div className="empty-icon">
                        📄
                    </div>

                    <h2>No applications yet</h2>

                    <p>
                        You haven't applied for any jobs yet.
                    </p>

                    <button
                        className="browse-button"
                        onClick={() => navigate("/jobs")}
                    >
                        Browse Jobs
                    </button>

                </div>
            )}

            {applications.length > 0 && (
                <div className="applications-list">

                    {applications.map((application) => {

                        const job = application.job;

                        const score =
                            application.aiAnalysis?.matchScore;

                        return (
                            <div
                                className="application-card"
                                key={application._id}
                            >

                                <div className="application-main">

                                    <div>
                                        <h2>
                                            {job?.title || "Job"}
                                        </h2>

                                        <p className="company">
                                            {job?.company || "Company"}
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

                                    {score !== undefined && (
                                        <span>
                                            🤖 AI Score:{" "}
                                            <strong>
                                                {score}%
                                            </strong>
                                        </span>
                                    )}

                                </div>

                                {application.aiAnalysis?.summary && (
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
                    })}

                </div>
            )}

            <style>{`
                .my-applications-page {
                    min-height: 100vh;
                    padding: 40px;
                    background: #f5f7fb;
                }

                .applications-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                    gap: 20px;
                }

                .applications-header h1 {
                    margin: 12px 0 6px;
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
                    padding: 0;
                }

                .browse-button {
                    border: none;
                    background: #111827;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .applications-list {
                    display: grid;
                    gap: 20px;
                }

                .application-card {
                    background: white;
                    border-radius: 14px;
                    padding: 24px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.06);
                }

                .application-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                }

                .application-main h2 {
                    margin: 0 0 6px;
                }

                .company {
                    margin: 0;
                    color: #666;
                }

                .application-status {
                    padding: 7px 13px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-applied {
                    background: #e8f1ff;
                    color: #2563eb;
                }

                .status-shortlisted {
                    background: #fff4d6;
                    color: #b77900;
                }

                .status-interview {
                    background: #eee5ff;
                    color: #7c3aed;
                }

                .status-selected {
                    background: #dcfce7;
                    color: #15803d;
                }

                .status-rejected {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .application-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 20px;
                    color: #555;
                }

                .analysis-preview {
                    margin-top: 20px;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                .analysis-preview h4 {
                    margin: 0 0 8px;
                }

                .analysis-preview p {
                    margin: 0;
                    line-height: 1.6;
                    color: #555;
                }

                .application-state {
                    max-width: 600px;
                    margin: 80px auto;
                    background: white;
                    padding: 50px;
                    text-align: center;
                    border-radius: 14px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.06);
                }

                .empty-icon {
                    font-size: 50px;
                    margin-bottom: 15px;
                }

                .application-error {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                @media (max-width: 700px) {
                    .my-applications-page {
                        padding: 20px;
                    }

                    .applications-header {
                        flex-direction: column;
                    }

                    .application-main {
                        flex-direction: column;
                    }
                }
            `}</style>

        </div>
    );
};

export default MyApplications;