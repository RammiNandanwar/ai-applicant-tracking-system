import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const CandidateRanking = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "recruiter") {
            navigate("/dashboard");
            return;
        }

        fetchCandidates();
    }, [jobId, user]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/applications/job/${jobId}`
            );

            setApplications(response.data.applications || []);

            if (response.data.applications?.length > 0) {
                setJob(response.data.applications[0].job);
            }
        } catch (error) {
            console.error("Error fetching candidates:", error);

            setError(
                error.response?.data?.error ||
                "Failed to load candidates"
            );
        } finally {
            setLoading(false);
        }
    };

    const getScoreClass = (score) => {
        if (score >= 80) {
            return "high";
        }

        if (score >= 60) {
            return "medium";
        }

        return "low";
    };

    const filteredApplications = applications.filter((application) => {
        const name =
            application.applicant?.name?.toLowerCase() || "";

        const email =
            application.applicant?.email?.toLowerCase() || "";

        const searchValue = search.toLowerCase();

        return (
            name.includes(searchValue) ||
            email.includes(searchValue)
        );
    });

    if (loading) {
        return (
            <div className="candidate-page">
                <div className="loading">
                    Loading candidates...
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-page">

            {/* HEADER */}
            <div className="candidate-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back
                    </button>

                    <h1>Candidate Ranking</h1>

                    {job && (
                        <p>
                            {job.title} • {job.company}
                        </p>
                    )}
                </div>

                <div className="candidate-count">
                    <strong>{applications.length}</strong>
                    <span>Applicants</span>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* SEARCH */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search candidate by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* CANDIDATES */}
            {filteredApplications.length === 0 ? (
                <div className="empty-state">
                    <h2>No candidates found</h2>
                    <p>
                        {applications.length === 0
                            ? "No one has applied for this job yet."
                            : "No candidates match your search."}
                    </p>
                </div>
            ) : (
                <div className="candidate-list">

                    {filteredApplications.map((application, index) => {
                        const score =
                            application.aiAnalysis?.matchScore || 0;

                        return (
                            <div
                                className="candidate-card"
                                key={application._id}
                            >

                                {/* RANK */}
                                <div className="candidate-rank">
                                    #{index + 1}
                                </div>

                                {/* BASIC INFO */}
                                <div className="candidate-info">
                                    <h2>
                                        {application.applicant?.name ||
                                            "Unknown Candidate"}
                                    </h2>

                                    <p>
                                        {application.applicant?.email ||
                                            "No email"}
                                    </p>

                                    <span className="status">
                                        {application.status}
                                    </span>
                                </div>

                                {/* AI SCORE */}
                                <div className="score-section">
                                    <div
                                        className={`score ${getScoreClass(
                                            score
                                        )}`}
                                    >
                                        {score}%
                                    </div>

                                    <span>AI Match Score</span>
                                </div>

                                {/* SKILLS */}
                                <div className="skills-section">
                                    <h4>Skills</h4>

                                    <div className="skills">
                                        {application.aiAnalysis?.skills
                                            ?.slice(0, 5)
                                            .map((skill, skillIndex) => (
                                                <span key={skillIndex}>
                                                    {skill}
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {/* VIEW BUTTON */}
                                <button
                                    className="view-button"
                                    onClick={() =>
                                        setSelectedCandidate(
                                            application
                                        )
                                    }
                                >
                                    View Analysis
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CANDIDATE DETAILS MODAL */}
            {selectedCandidate && (
                <div className="modal-overlay">
                    <div className="candidate-modal">

                        <button
                            className="close-button"
                            onClick={() =>
                                setSelectedCandidate(null)
                            }
                        >
                            ×
                        </button>

                        <h2>
                            {selectedCandidate.applicant?.name}
                        </h2>

                        <p>
                            {selectedCandidate.applicant?.email}
                        </p>

                        <div className="modal-score">
                            <strong>
                                {selectedCandidate.aiAnalysis
                                    ?.matchScore || 0}
                                %
                            </strong>

                            <span>
                                AI Match Score
                            </span>
                        </div>

                        <div className="analysis-section">
                            <h3>Summary</h3>

                            <p>
                                {selectedCandidate.aiAnalysis
                                    ?.summary ||
                                    "No summary available."}
                            </p>
                        </div>

                        <div className="analysis-section">
                            <h3>Skills</h3>

                            <div className="skills">
                                {selectedCandidate.aiAnalysis?.skills
                                    ?.map((skill, index) => (
                                        <span key={index}>
                                            {skill}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div className="analysis-section">
                            <h3>Experience</h3>

                            <p>
                                {selectedCandidate.aiAnalysis
                                    ?.experience ||
                                    "No experience information available."}
                            </p>
                        </div>

                        <div className="analysis-section">
                            <h3>Strengths</h3>

                            <ul>
                                {selectedCandidate.aiAnalysis?.strengths
                                    ?.map((strength, index) => (
                                        <li key={index}>
                                            {strength}
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div className="analysis-section">
                            <h3>Missing Skills</h3>

                            {selectedCandidate.aiAnalysis
                                ?.missingSkills?.length > 0 ? (
                                <div className="missing-skills">
                                    {selectedCandidate.aiAnalysis.missingSkills.map(
                                        (skill, index) => (
                                            <span key={index}>
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p>
                                    No major missing skills detected.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* PAGE STYLES */}
            <style>{`
                .candidate-page {
                    min-height: 100vh;
                    padding: 40px;
                    background: #f5f7fb;
                    font-family: Arial, sans-serif;
                }

                .candidate-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .candidate-header h1 {
                    margin: 10px 0 5px;
                    font-size: 32px;
                }

                .candidate-header p {
                    color: #666;
                    margin: 0;
                }

                .back-button {
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 15px;
                }

                .candidate-count {
                    background: white;
                    padding: 15px 25px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.06);
                }

                .candidate-count strong {
                    font-size: 25px;
                }

                .candidate-count span {
                    color: #777;
                    font-size: 13px;
                }

                .search-container {
                    margin-bottom: 25px;
                }

                .search-container input {
                    width: 100%;
                    max-width: 500px;
                    padding: 14px 16px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 15px;
                    outline: none;
                    box-sizing: border-box;
                }

                .candidate-list {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .candidate-card {
                    background: white;
                    border-radius: 15px;
                    padding: 22px;
                    display: grid;
                    grid-template-columns: 60px 1.5fr 130px 2fr 150px;
                    gap: 20px;
                    align-items: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                }

                .candidate-rank {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                }

                .candidate-info h2 {
                    margin: 0 0 5px;
                    font-size: 19px;
                }

                .candidate-info p {
                    margin: 0 0 10px;
                    color: #666;
                    font-size: 14px;
                }

                .status {
                    display: inline-block;
                    padding: 5px 10px;
                    background: #eef2ff;
                    border-radius: 20px;
                    font-size: 12px;
                    text-transform: capitalize;
                }

                .score-section {
                    text-align: center;
                }

                .score {
                    font-size: 27px;
                    font-weight: bold;
                }

                .score-section span {
                    font-size: 11px;
                    color: #777;
                }

                .score.high {
                    color: #16a34a;
                }

                .score.medium {
                    color: #d97706;
                }

                .score.low {
                    color: #dc2626;
                }

                .skills-section h4 {
                    margin: 0 0 8px;
                }

                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .skills span,
                .missing-skills span {
                    padding: 5px 9px;
                    border-radius: 15px;
                    background: #eef2f7;
                    font-size: 12px;
                }

                .view-button {
                    padding: 11px 15px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    background: #111827;
                    color: white;
                }

                .view-button:hover {
                    opacity: 0.9;
                }

                .loading,
                .empty-state {
                    background: white;
                    padding: 50px;
                    text-align: center;
                    border-radius: 15px;
                }

                .error-message {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 14px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    z-index: 1000;
                }

                .candidate-modal {
                    position: relative;
                    background: white;
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border-radius: 18px;
                    padding: 30px;
                }

                .close-button {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    border: none;
                    background: transparent;
                    font-size: 30px;
                    cursor: pointer;
                }

                .candidate-modal h2 {
                    margin-bottom: 5px;
                }

                .candidate-modal > p {
                    color: #666;
                }

                .modal-score {
                    margin: 25px 0;
                    padding: 20px;
                    border-radius: 12px;
                    background: #f5f7fb;
                    text-align: center;
                }

                .modal-score strong {
                    display: block;
                    font-size: 42px;
                }

                .modal-score span {
                    color: #666;
                }

                .analysis-section {
                    margin-top: 25px;
                }

                .analysis-section h3 {
                    margin-bottom: 8px;
                }

                .analysis-section p {
                    color: #555;
                    line-height: 1.6;
                }

                .analysis-section li {
                    margin-bottom: 8px;
                }

                .missing-skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                @media (max-width: 1000px) {
                    .candidate-card {
                        grid-template-columns: 50px 1fr 100px;
                    }

                    .skills-section {
                        grid-column: 2 / 4;
                    }

                    .view-button {
                        grid-column: 2 / 4;
                    }
                }

                @media (max-width: 600px) {
                    .candidate-page {
                        padding: 20px;
                    }

                    .candidate-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .candidate-card {
                        grid-template-columns: 1fr;
                    }

                    .skills-section,
                    .view-button {
                        grid-column: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default CandidateRanking;