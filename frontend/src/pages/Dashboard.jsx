import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // ======================================
    // APPLICANT DASHBOARD
    // ======================================

    if (user?.role === "applicant") {
        return (
            <div className="ats-dashboard">

                <header className="ats-header">

                    <div>
                        <h1>
                            Applicant Dashboard
                        </h1>

                        <p>
                            Welcome back! Find jobs and
                            manage your applications.
                        </p>
                    </div>

                    <div className="ats-user-section">

                        <div className="ats-user-info">

                            <strong>
                                {user?.name}
                            </strong>

                            <span>
                                {user?.email}
                            </span>

                            <small>
                                Applicant
                            </small>

                        </div>

                        <button
                            className="ats-logout-btn"
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                <section className="ats-applicant-content">

                    <div className="ats-welcome-card">

                        <div className="ats-welcome-icon">
                            👋
                        </div>

                        <h2>
                            Welcome, {user?.name}!
                        </h2>

                        <p>
                            Explore available opportunities,
                            apply for jobs and track your
                            applications from one place.
                        </p>

                    </div>


                    <div className="ats-applicant-actions">

                        <div className="ats-action-card">

                            <div className="ats-action-icon">
                                💼
                            </div>

                            <h3>
                                Browse Jobs
                            </h3>

                            <p>
                                Find jobs that match your
                                skills and experience.
                            </p>

                            <button
                                className="ats-create-btn"
                                onClick={() =>
                                    navigate("/jobs")
                                }
                            >
                                Browse Jobs
                            </button>

                        </div>


                        <div className="ats-action-card">

                            <div className="ats-action-icon">
                                📄
                            </div>

                            <h3>
                                My Applications
                            </h3>

                            <p>
                                Track the jobs you have
                                applied for.
                            </p>

                            <button
                                className="ats-view-btn"
                                onClick={() =>
                                    navigate("/applications")
                                }
                            >
                                View Applications
                            </button>

                        </div>

                    </div>

                </section>


                <style>{`

                    .ats-dashboard {
                        min-height: 100vh;
                        padding: 40px;
                        background: #f5f7fb;
                        font-family: Arial, sans-serif;
                    }

                    .ats-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 35px;
                    }

                    .ats-header h1 {
                        margin: 0 0 8px;
                        font-size: 32px;
                    }

                    .ats-header p {
                        margin: 0;
                        color: #666;
                    }

                    .ats-user-section {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }

                    .ats-user-info {
                        display: flex;
                        flex-direction: column;
                        text-align: right;
                    }

                    .ats-user-info strong {
                        font-size: 16px;
                    }

                    .ats-user-info span {
                        color: #666;
                        font-size: 14px;
                        margin-top: 3px;
                    }

                    .ats-user-info small {
                        color: #2563eb;
                        margin-top: 4px;
                        font-weight: bold;
                    }

                    .ats-logout-btn {
                        padding: 10px 18px;
                        border: none;
                        border-radius: 8px;
                        background: #111827;
                        color: white;
                        cursor: pointer;
                    }

                    .ats-applicant-content {
                        max-width: 1100px;
                        margin: auto;
                    }

                    .ats-welcome-card {
                        background: white;
                        border-radius: 16px;
                        padding: 35px;
                        text-align: center;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                    }

                    .ats-welcome-icon {
                        font-size: 45px;
                        margin-bottom: 10px;
                    }

                    .ats-welcome-card h2 {
                        margin: 10px 0;
                        font-size: 26px;
                    }

                    .ats-welcome-card p {
                        max-width: 600px;
                        margin: auto;
                        color: #666;
                        line-height: 1.6;
                    }

                    .ats-applicant-actions {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 25px;
                        margin-top: 25px;
                    }

                    .ats-action-card {
                        background: white;
                        border-radius: 16px;
                        padding: 30px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                    }

                    .ats-action-icon {
                        font-size: 35px;
                    }

                    .ats-action-card h3 {
                        font-size: 21px;
                        margin: 15px 0 8px;
                    }

                    .ats-action-card p {
                        color: #666;
                        line-height: 1.5;
                        margin-bottom: 20px;
                    }

                    .ats-create-btn,
                    .ats-view-btn {
                        padding: 11px 18px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    }

                    .ats-create-btn {
                        background: #111827;
                        color: white;
                    }

                    .ats-view-btn {
                        background: #e5e7eb;
                        color: #111827;
                    }

                    @media (max-width: 700px) {

                        .ats-dashboard {
                            padding: 20px;
                        }

                        .ats-header {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 25px;
                        }

                        .ats-user-section {
                            width: 100%;
                            justify-content: space-between;
                        }

                        .ats-user-info {
                            text-align: left;
                        }

                        .ats-applicant-actions {
                            grid-template-columns: 1fr;
                        }
                    }

                `}</style>

            </div>
        );
    }


// ======================================
// RECRUITER DASHBOARD
// ======================================

if (user?.role === "recruiter") {
    return (
        <RecruiterDashboard
            user={user}
            logout={logout}
            navigate={navigate}
        />
    );
}

return (
    <div className="ats-dashboard">
        <div className="ats-state-card">
            <h2>Unable to load dashboard</h2>
            <p>
                Your account role could not be determined.
                Please log in again.
            </p>

            <button
                className="ats-create-btn"
                onClick={() => {
                    logout();
                    navigate("/login");
                }}
            >
                Back to Login
            </button>
        </div>
    </div>
);
};


// =====================================================
// RECRUITER DASHBOARD COMPONENT
// =====================================================

const RecruiterDashboard = ({
    user,
    logout,
    navigate
}) => {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
        employmentType: "Full-time"
    });


    // ======================================
    // FETCH JOBS
    // ======================================

    const fetchJobs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/jobs");

            const allJobs =
                response.data.jobs || [];

            const currentUserId =
                user?._id || user?.id;

            const recruiterJobs =
                allJobs.filter((job) => {

                    const recruiterId =
                        job.recruiter?._id ||
                        job.recruiter?.id ||
                        job.recruiter;

                    return (
                        String(recruiterId) ===
                        String(currentUserId)
                    );

                });

            setJobs(recruiterJobs);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to load jobs."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        if (user?.role === "recruiter") {
            fetchJobs();
        }

    }, [user]);


    // ======================================
    // FORM CHANGE
    // ======================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ======================================
    // CREATE JOB
    // ======================================

    const handleCreateJob = async (e) => {

        e.preventDefault();

        try {

            setCreating(true);
            setError("");

            const skillsArray =
                formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean);

            const response =
                await API.post("/jobs", {

                    title: formData.title,

                    description:
                        formData.description,

                    company:
                        formData.company,

                    location:
                        formData.location,

                    skills:
                        skillsArray,

                    experience:
                        formData.experience,

                    salary:
                        formData.salary,

                    employmentType:
                        formData.employmentType

                });

            const newJob =
                response.data.job;

            setJobs((previousJobs) => [
                newJob,
                ...previousJobs
            ]);

            setFormData({
                title: "",
                description: "",
                company: "",
                location: "",
                skills: "",
                experience: "",
                salary: "",
                employmentType: "Full-time"
            });

            setShowCreateForm(false);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to create job."
            );

        } finally {

            setCreating(false);

        }
    };


    // ======================================
    // ARCHIVE JOB
    // ======================================

    const handleArchiveJob = async (jobId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to archive this job?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await API.delete(
                `/jobs/${jobId}`
            );

            setJobs((previousJobs) =>
                previousJobs.filter(
                    (job) =>
                        job._id !== jobId
                )
            );

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to archive job."
            );

        }
    };


    // ======================================
    // LOGOUT
    // ======================================

    const handleLogout = () => {

        logout();
        navigate("/login");

    };


    // ======================================
    // STATS
    // ======================================

    const totalJobs =
        jobs.length;

    const activeJobs =
        jobs.filter(
            (job) =>
                job.status === "active"
        ).length;


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="ats-dashboard">

                <div className="ats-state-card">

                    <h2>
                        Loading recruiter dashboard...
                    </h2>

                    <p>
                        Please wait while we load
                        your jobs.
                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // RECRUITER UI
    // ======================================

    return (

        <div className="ats-dashboard">

            <header className="ats-header">

                <div>

                    <h1>
                        Recruiter Dashboard
                    </h1>

                    <p>
                        Manage your job openings
                        and candidates.
                    </p>

                </div>


                <div className="ats-user-section">

                    <div className="ats-user-info">

                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            {user?.email}
                        </span>

                        <small>
                            Recruiter
                        </small>

                    </div>


                    <button
                        className="ats-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {error && (
                <div className="ats-error">
                    {error}
                </div>
            )}


            {/* STATS */}

            <section className="ats-stats">

                <div className="ats-stat-card">

                    <span>
                        Total Jobs
                    </span>

                    <strong>
                        {totalJobs}
                    </strong>

                </div>


                <div className="ats-stat-card">

                    <span>
                        Active Jobs
                    </span>

                    <strong>
                        {activeJobs}
                    </strong>

                </div>


                <div className="ats-stat-card">

                    <span>
                        Candidate Ranking
                    </span>

                    <strong>
                        AI
                    </strong>

                </div>

            </section>


            {/* JOB SECTION */}

            <section className="ats-job-section">

                <div className="ats-section-header">

                    <div>

                        <h2>
                            My Job Listings
                        </h2>

                        <p>
                            Create and manage your
                            recruitment opportunities.
                        </p>

                    </div>


                    <button
                        className="ats-create-btn"
                        onClick={() =>
                            setShowCreateForm(
                                !showCreateForm
                            )
                        }
                    >
                        {showCreateForm
                            ? "Cancel"
                            : "+ Create New Job"}
                    </button>

                </div>


                {/* CREATE FORM */}

                {showCreateForm && (

                    <form
                        className="ats-create-form"
                        onSubmit={
                            handleCreateJob
                        }
                    >

                        <h2>
                            Create New Job
                        </h2>


                        <div className="ats-form-grid">

                            <div className="ats-form-group">

                                <label>
                                    Job Title
                                </label>

                                <input
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. MERN Stack Developer"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Company
                                </label>

                                <input
                                    name="company"
                                    value={
                                        formData.company
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Company name"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Pune / Remote"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Experience
                                </label>

                                <input
                                    name="experience"
                                    value={
                                        formData.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 1-3 years"
                                    required
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Salary
                                </label>

                                <input
                                    name="salary"
                                    value={
                                        formData.salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 6-8 LPA"
                                />

                            </div>


                            <div className="ats-form-group">

                                <label>
                                    Employment Type
                                </label>

                                <select
                                    name="employmentType"
                                    value={
                                        formData.employmentType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Part-time">
                                        Part-time
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="ats-form-group">

                            <label>
                                Required Skills
                            </label>

                            <input
                                name="skills"
                                value={
                                    formData.skills
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="React, Node.js, MongoDB, Express"
                                required
                            />

                            <small>
                                Separate skills using commas.
                            </small>

                        </div>


                        <div className="ats-form-group">

                            <label>
                                Job Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter complete job description..."
                                rows="6"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="ats-submit-btn"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating Job..."
                                : "Create Job"}
                        </button>

                    </form>

                )}


                {/* NO JOBS */}

                {!showCreateForm &&
                    jobs.length === 0 && (

                        <div className="ats-empty">

                            <div>
                                📋
                            </div>

                            <h3>
                                No jobs created yet
                            </h3>

                            <p>
                                Create your first job
                                opening to start
                                receiving applications.
                            </p>

                            <button
                                className="ats-create-btn"
                                onClick={() =>
                                    setShowCreateForm(
                                        true
                                    )
                                }
                            >
                                + Create Your First Job
                            </button>

                        </div>

                    )}


                {/* JOB CARDS */}

                {jobs.length > 0 && (

                    <div className="ats-job-grid">

                        {jobs.map((job) => (

                            <div
                                className="ats-job-card"
                                key={job._id}
                            >

                                <div className="ats-job-top">

                                    <div>

                                        <h3>
                                            {job.title}
                                        </h3>

                                        <p>
                                            {job.company}
                                        </p>

                                    </div>


                                    <span className="ats-status">
                                        {job.status}
                                    </span>

                                </div>


                                <div className="ats-job-details">

                                    <span>
                                        📍 {job.location}
                                    </span>

                                    <span>
                                        💼{" "}
                                        {
                                            job.employmentType
                                        }
                                    </span>

                                    <span>
                                        🎓{" "}
                                        {
                                            job.experience
                                        }
                                    </span>

                                </div>


                                <div className="ats-skills">

                                    {(Array.isArray(
                                        job.skills
                                    )
                                        ? job.skills
                                        : [job.skills]
                                    ).map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    index
                                                }
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>


                                <div className="ats-job-actions">

                                    <button
                                        className="ats-view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/jobs/${job._id}`
                                            )
                                        }
                                    >
                                        View Job
                                    </button>


                                    <button
                                        className="ats-ranking-btn"
                                        onClick={() =>
                                            navigate(
                                                `/recruiter/jobs/${job._id}/candidates`
                                            )
                                        }
                                    >
                                        View Candidates
                                    </button>


                                    <button
                                        className="ats-archive-btn"
                                        onClick={() =>
                                            handleArchiveJob(
                                                job._id
                                            )
                                        }
                                    >
                                        Archive
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>

    );
};

export default Dashboard;