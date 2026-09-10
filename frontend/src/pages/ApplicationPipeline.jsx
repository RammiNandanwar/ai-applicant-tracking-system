import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const statuses = [
    "applied",
    "shortlisted",
    "interview",
    "selected",
    "rejected"
];

const ApplicationPipeline = () => {
    const { jobId } = useParams();
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

        if (user.role !== "recruiter") {
            navigate("/dashboard");
            return;
        }

        fetchApplications();
    }, [user, jobId]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/applications/job/${jobId}`
            );

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
                "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (
        applicationId,
        newStatus
    ) => {
        try {
            await API.patch(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus
                }
            );

            setApplications((current) =>
                current.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status: newStatus
                          }
                        : application
                )
            );
        } catch (error) {
            console.error(
                "Error updating status:",
                error
            );

            alert(
                error.response?.data?.error ||
                "Unable to update application status."
            );
        }
    };

    const getApplicationsByStatus = (status) => {
        return applications.filter(
            (application) =>
                application.status === status
        );
    };

    if (loading) {
        return (
            <div className="pipeline-page">
                <h2>Loading applications...</h2>
            </div>
        );
    }

    return (
        <div className="pipeline-page">

            <div className="pipeline-header">

                <div>
                    <button
                        className="pipeline-back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <h1>Application Pipeline</h1>

                    <p>
                        Manage candidates through the
                        recruitment process.
                    </p>
                </div>

                <button
                    className="ranking-button"
                    onClick={() =>
                        navigate(
                            `/recruiter/jobs/${jobId}/candidates`
                        )
                    }
                >
                    View Candidate Ranking
                </button>

            </div>

            {error && (
                <div className="pipeline-error">
                    {error}
                </div>
            )}

            <div className="pipeline-board">

                {statuses.map((status) => {

                    const statusApplications =
                        getApplicationsByStatus(status);

                    return (
                        <div
                            className="pipeline-column"
                            key={status}
                        >

                            <div className="column-header">

                                <h3>
                                    {status}
                                </h3>

                                <span>
                                    {
                                        statusApplications.length
                                    }
                                </span>

                            </div>

                            <div className="candidate-list">

                                {statusApplications.length ===
                                    0 && (
                                    <div className="empty-column">
                                        No candidates
                                    </div>
                                )}

                                {statusApplications.map(
                                    (application) => {

                                        const applicant =
                                            application.applicant;

                                        const score =
                                            application.aiAnalysis
                                                ?.matchScore;

                                        return (
                                            <div
                                                className="candidate-card"
                                                key={
                                                    application._id
                                                }
                                            >

                                                <div className="candidate-name">
                                                    {
                                                        applicant
                                                            ?.name ||
                                                        "Candidate"
                                                    }
                                                </div>

                                                <div className="candidate-email">
                                                    {
                                                        applicant
                                                            ?.email ||
                                                        "No email"
                                                    }
                                                </div>

                                                {score !==
                                                    undefined && (
                                                    <div className="candidate-score">
                                                        AI Match:{" "}
                                                        <strong>
                                                            {
                                                                score
                                                            }
                                                            %
                                                        </strong>
                                                    </div>
                                                )}

                                                {application
                                                    .aiAnalysis
                                                    ?.summary && (
                                                    <p className="candidate-summary">
                                                        {
                                                            application
                                                                .aiAnalysis
                                                                .summary
                                                        }
                                                    </p>
                                                )}

                                                <select
                                                    value={
                                                        application.status
                                                    }
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            application._id,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                >
                                                    {statuses.map(
                                                        (
                                                            statusOption
                                                        ) => (
                                                            <option
                                                                key={
                                                                    statusOption
                                                                }
                                                                value={
                                                                    statusOption
                                                                }
                                                            >
                                                                {statusOption}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    );
                })}

            </div>

            <style>{`
                .pipeline-page {
                    min-height: 100vh;
                    padding: 35px;
                    background: #f5f7fb;
                }

                .pipeline-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .pipeline-header h1 {
                    margin: 12px 0 6px;
                    font-size: 32px;
                }

                .pipeline-header p {
                    margin: 0;
                    color: #666;
                }

                .pipeline-back {
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 15px;
                }

                .ranking-button {
                    border: none;
                    background: #111827;
                    color: white;
                    padding: 12px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .pipeline-error {
                    padding: 15px;
                    background: #fee2e2;
                    color: #b91c1c;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .pipeline-board {
                    display: grid;
                    grid-template-columns: repeat(5, minmax(220px, 1fr));
                    gap: 18px;
                    align-items: start;
                    overflow-x: auto;
                }

                .pipeline-column {
                    background: #e9edf3;
                    border-radius: 12px;
                    padding: 14px;
                    min-height: 500px;
                }

                .column-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .column-header h3 {
                    margin: 0;
                    text-transform: capitalize;
                    font-size: 16px;
                }

                .column-header span {
                    background: white;
                    padding: 4px 9px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .candidate-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .candidate-card {
                    background: white;
                    border-radius: 10px;
                    padding: 16px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                }

                .candidate-name {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .candidate-email {
                    font-size: 13px;
                    color: #777;
                    margin-bottom: 12px;
                    word-break: break-word;
                }

                .candidate-score {
                    font-size: 13px;
                    margin-bottom: 10px;
                }

                .candidate-summary {
                    font-size: 13px;
                    color: #666;
                    line-height: 1.5;
                    margin: 10px 0;
                }

                .candidate-card select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 7px;
                    background: white;
                    cursor: pointer;
                    text-transform: capitalize;
                }

                .empty-column {
                    color: #888;
                    font-size: 13px;
                    text-align: center;
                    padding: 25px 5px;
                }

                @media (max-width: 1200px) {
                    .pipeline-board {
                        grid-template-columns: repeat(
                            5,
                            250px
                        );
                    }
                }

                @media (max-width: 700px) {
                    .pipeline-page {
                        padding: 20px;
                    }

                    .pipeline-header {
                        flex-direction: column;
                    }
                }
            `}</style>

        </div>
    );
};

export default ApplicationPipeline;