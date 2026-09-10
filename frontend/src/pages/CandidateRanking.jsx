import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth";

const statuses = [
    "all",
    "applied",
    "shortlisted",
    "interview",
    "selected",
    "rejected"
];

const CandidateRanking = () => {
    const { jobId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [minimumScore, setMinimumScore] = useState(0);
    const [sortBy, setSortBy] = useState("score");

    const [selectedCandidate, setSelectedCandidate] =
        useState(null);

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
    }, [user, jobId]);

    const fetchCandidates = async () => {
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
                "Error fetching candidates:",
                error
            );

            setError(
                error.response?.data?.error ||
                "Unable to load candidates."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
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

            if (
                selectedCandidate?._id ===
                applicationId
            ) {
                setSelectedCandidate((current) => ({
                    ...current,
                    status: newStatus
                }));
            }
        } catch (error) {
            console.error(
                "Error updating application status:",
                error
            );

            alert(
                error.response?.data?.error ||
                "Unable to update application status."
            );
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setMinimumScore(0);
        setSortBy("score");
    };

    const filteredCandidates = useMemo(() => {
        let result = [...applications];

        const search = searchTerm
            .trim()
            .toLowerCase();

        if (search) {
            result = result.filter((application) => {
                const name =
                    application.applicant?.name
                        ?.toLowerCase() || "";

                const email =
                    application.applicant?.email
                        ?.toLowerCase() || "";

                return (
                    name.includes(search) ||
                    email.includes(search)
                );
            });
        }

        if (statusFilter !== "all") {
            result = result.filter(
                (application) =>
                    application.status ===
                    statusFilter
            );
        }

        result = result.filter((application) => {
            const score =
                application.aiAnalysis?.matchScore || 0;

            return score >= Number(minimumScore);
        });

        if (sortBy === "score") {
            result.sort((a, b) => {
                const scoreA =
                    a.aiAnalysis?.matchScore || 0;

                const scoreB =
                    b.aiAnalysis?.matchScore || 0;

                return scoreB - scoreA;
            });
        }

        if (sortBy === "score-low") {
            result.sort((a, b) => {
                const scoreA =
                    a.aiAnalysis?.matchScore || 0;

                const scoreB =
                    b.aiAnalysis?.matchScore || 0;

                return scoreA - scoreB;
            });
        }

        if (sortBy === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
        }

        if (sortBy === "oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
            );
        }

        return result;
    }, [
        applications,
        searchTerm,
        statusFilter,
        minimumScore,
        sortBy
    ]);

    if (loading) {
        return (
            <div className="candidate-page">
                <div className="candidate-state">
                    <h2>
                        Loading candidates...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-page">

            <header className="candidate-header">

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
                        Candidate Ranking
                    </h1>

                    <p>
                        Review and rank candidates
                        using AI-powered resume
                        analysis.
                    </p>
                </div>

                <button
                    className="pipeline-button"
                    onClick={() =>
                        navigate(
                            `/recruiter/jobs/${jobId}/pipeline`
                        )
                    }
                >
                    Application Pipeline
                </button>

            </header>

            {error && (
                <div className="candidate-error">
                    {error}
                </div>
            )}

            {!error && (
                <>
                    <div className="stats-card">

                        <div>
                            <span>
                                Total Applications
                            </span>

                            <strong>
                                {applications.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Showing Candidates
                            </span>

                            <strong>
                                {
                                    filteredCandidates.length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Top AI Score
                            </span>

                            <strong>
                                {applications.length
                                    ? Math.max(
                                          ...applications.map(
                                              (application) =>
                                                  application
                                                      .aiAnalysis
                                                      ?.matchScore ||
                                                  0
                                          )
                                      ) + "%"
                                    : "0%"}
                            </strong>
                        </div>

                    </div>

                    <div className="filters-card">

                        <div className="filter-group">

                            <label>
                                Search Candidate
                            </label>

                            <input
                                type="text"
                                placeholder="Name or email..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="filter-group">

                            <label>
                                Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >
                                {statuses.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status ===
                                            "all"
                                                ? "All Statuses"
                                                : status}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        <div className="filter-group">

                            <label>
                                Minimum AI Score
                            </label>

                            <select
                                value={minimumScore}
                                onChange={(e) =>
                                    setMinimumScore(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="0">
                                    Any Score
                                </option>

                                <option value="50">
                                    50%+
                                </option>

                                <option value="60">
                                    60%+
                                </option>

                                <option value="70">
                                    70%+
                                </option>

                                <option value="80">
                                    80%+
                                </option>

                                <option value="90">
                                    90%+
                                </option>
                            </select>

                        </div>

                        <div className="filter-group">

                            <label>
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="score">
                                    AI Score: High → Low
                                </option>

                                <option value="score-low">
                                    AI Score: Low → High
                                </option>

                                <option value="newest">
                                    Newest Applications
                                </option>

                                <option value="oldest">
                                    Oldest Applications
                                </option>
                            </select>

                        </div>

                        <button
                            className="clear-button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                    {filteredCandidates.length ===
                        0 && (
                        <div className="candidate-state">

                            <h2>
                                No candidates found
                            </h2>

                            <p>
                                Try changing your
                                search or filters.
                            </p>

                        </div>
                    )}

                    {filteredCandidates.length > 0 && (
                        <div className="candidate-grid">

                            {filteredCandidates.map(
                                (application, index) => {

                                    const applicant =
                                        application.applicant;

                                    const analysis =
                                        application.aiAnalysis;

                                    const score =
                                        analysis?.matchScore ||
                                        0;

                                    return (
                                        <div
                                            className="candidate-card"
                                            key={
                                                application._id
                                            }
                                        >

                                            <div className="rank">
                                                #{index + 1}
                                            </div>

                                            <div className="candidate-top">

                                                <div>
                                                    <h2>
                                                        {
                                                            applicant?.name ||
                                                            "Candidate"
                                                        }
                                                    </h2>

                                                    <p>
                                                        {
                                                            applicant?.email ||
                                                            "No email"
                                                        }
                                                    </p>
                                                </div>

                                                <div className="score">
                                                    <strong>
                                                        {score}%
                                                    </strong>

                                                    <span>
                                                        AI Match
                                                    </span>
                                                </div>

                                            </div>

                                            <div className="candidate-status">

                                                <select
                                                    value={
                                                        application.status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleStatusChange(
                                                            application._id,
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                >
                                                    {statuses
                                                        .filter(
                                                            (
                                                                status
                                                            ) =>
                                                                status !==
                                                                "all"
                                                        )
                                                        .map(
                                                            (
                                                                status
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        status
                                                                    }
                                                                    value={
                                                                        status
                                                                    }
                                                                >
                                                                    {
                                                                        status
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </select>

                                            </div>

                                            <div className="skills">

                                                <h4>
                                                    Skills
                                                </h4>

                                                <div className="skill-list">

                                                    {analysis?.skills
                                                        ?.slice(
                                                            0,
                                                            6
                                                        )
                                                        .map(
                                                            (
                                                                skill,
                                                                skillIndex
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        skillIndex
                                                                    }
                                                                >
                                                                    {
                                                                        skill
                                                                    }
                                                                </span>
                                                            )
                                                        )}

                                                </div>

                                            </div>

                                            <button
                                                className="details-button"
                                                onClick={() =>
                                                    setSelectedCandidate(
                                                        application
                                                    )
                                                }
                                            >
                                                View AI Analysis
                                            </button>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </>
            )}

            {selectedCandidate && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedCandidate(null)
                    }
                >

                    <div
                        className="analysis-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-button"
                            onClick={() =>
                                setSelectedCandidate(
                                    null
                                )
                            }
                        >
                            ×
                        </button>

                        <h2>
                            {
                                selectedCandidate
                                    .applicant?.name ||
                                "Candidate"
                            }
                        </h2>

                        <p className="modal-email">
                            {
                                selectedCandidate
                                    .applicant?.email
                            }
                        </p>

                        <div className="modal-score">
                            <strong>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.matchScore || 0
                                }
                                %
                            </strong>

                            <span>
                                AI Match Score
                            </span>
                        </div>

                        <section>
                            <h3>
                                Summary
                            </h3>

                            <p>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.summary ||
                                    "No summary available."
                                }
                            </p>
                        </section>

                        <section>
                            <h3>
                                Experience
                            </h3>

                            <p>
                                {
                                    selectedCandidate
                                        .aiAnalysis
                                        ?.experience ||
                                    "No experience information available."
                                }
                            </p>
                        </section>

                        <section>
                            <h3>
                                Strengths
                            </h3>

                            <ul>
                                {selectedCandidate
                                    .aiAnalysis
                                    ?.strengths?.length ? (
                                    selectedCandidate.aiAnalysis.strengths.map(
                                        (
                                            strength,
                                            index
                                        ) => (
                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                {strength}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li>
                                        No strengths
                                        available.
                                    </li>
                                )}
                            </ul>
                        </section>

                        <section>
                            <h3>
                                Missing Skills
                            </h3>

                            <ul>
                                {selectedCandidate
                                    .aiAnalysis
                                    ?.missingSkills
                                    ?.length ? (
                                    selectedCandidate.aiAnalysis.missingSkills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                {skill}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li>
                                        No missing
                                        skills found.
                                    </li>
                                )}
                            </ul>
                        </section>

                    </div>

                </div>
            )}

            <style>{`
                .candidate-page {
                    min-height: 100vh;
                    padding: 35px;
                    background: #f5f7fb;
                }

                .candidate-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .candidate-header h1 {
                    margin: 12px 0 6px;
                    font-size: 32px;
                }

                .candidate-header p {
                    margin: 0;
                    color: #666;
                }

                .back-button {
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 15px;
                }

                .pipeline-button {
                    border: none;
                    background: #111827;
                    color: white;
                    padding: 12px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .candidate-error {
                    background: #fee2e2;
                    color: #b91c1c;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .stats-card {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 18px;
                    margin-bottom: 20px;
                }

                .stats-card > div {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .stats-card span {
                    display: block;
                    color: #777;
                    font-size: 13px;
                    margin-bottom: 8px;
                }

                .stats-card strong {
                    font-size: 25px;
                }

                .filters-card {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr auto;
                    gap: 15px;
                    align-items: end;
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .filter-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 7px;
                }

                .filter-group input,
                .filter-group select {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 7px;
                    background: white;
                }

                .clear-button {
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 7px;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .candidate-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fill,
                        minmax(300px, 1fr)
                    );
                    gap: 20px;
                }

                .candidate-card {
                    position: relative;
                    background: white;
                    padding: 22px;
                    border-radius: 14px;
                    box-shadow: 0 5px 18px rgba(0,0,0,0.06);
                }

                .rank {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #777;
                }

                .candidate-top {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                }

                .candidate-top h2 {
                    margin: 0 0 5px;
                    font-size: 19px;
                }

                .candidate-top p {
                    margin: 0;
                    color: #777;
                    font-size: 13px;
                    word-break: break-word;
                }

                .score {
                    text-align: center;
                    min-width: 65px;
                }

                .score strong {
                    display: block;
                    font-size: 22px;
                }

                .score span {
                    font-size: 11px;
                    color: #777;
                }

                .candidate-status {
                    margin-top: 18px;
                }

                .candidate-status select {
                    width: 100%;
                    padding: 9px;
                    border: 1px solid #ddd;
                    border-radius: 7px;
                    text-transform: capitalize;
                    background: white;
                }

                .skills {
                    margin-top: 18px;
                }

                .skills h4 {
                    margin: 0 0 10px;
                }

                .skill-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .skill-list span {
                    background: #f1f5f9;
                    padding: 5px 9px;
                    border-radius: 15px;
                    font-size: 12px;
                }

                .details-button {
                    width: 100%;
                    margin-top: 20px;
                    padding: 10px;
                    border: none;
                    border-radius: 7px;
                    background: #111827;
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                }

                .candidate-state {
                    background: white;
                    padding: 50px;
                    text-align: center;
                    border-radius: 14px;
                    box-shadow: 0 5px 18px rgba(0,0,0,0.05);
                }

                .candidate-state p {
                    color: #777;
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

                .analysis-modal {
                    position: relative;
                    background: white;
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 30px;
                    border-radius: 15px;
                }

                .close-button {
                    position: absolute;
                    right: 18px;
                    top: 12px;
                    border: none;
                    background: transparent;
                    font-size: 30px;
                    cursor: pointer;
                }

                .modal-email {
                    color: #777;
                }

                .modal-score {
                    margin: 20px 0;
                    padding: 18px;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                .modal-score strong {
                    display: block;
                    font-size: 32px;
                }

                .modal-score span {
                    color: #777;
                }

                .analysis-modal section {
                    margin-top: 20px;
                }

                .analysis-modal section h3 {
                    margin-bottom: 7px;
                }

                .analysis-modal section p {
                    line-height: 1.6;
                    color: #555;
                }

                @media (max-width: 1000px) {
                    .filters-card {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .stats-card {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 700px) {
                    .candidate-page {
                        padding: 20px;
                    }

                    .candidate-header {
                        flex-direction: column;
                    }

                    .filters-card {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

        </div>
    );
};

export default CandidateRanking;