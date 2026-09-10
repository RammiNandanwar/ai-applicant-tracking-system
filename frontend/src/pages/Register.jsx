import { useState } from "react";
import API from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "applicant"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/register",
                formData
            );

            setMessage(
                response.data.message ||
                "Registration successful"
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "applicant"
            });

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div>
                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>


                {/* EMAIL */}

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>


                {/* PASSWORD */}

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>


                {/* ROLE */}

                <div>
                    <label>Register As</label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="applicant">
                            Applicant
                        </option>

                        <option value="recruiter">
                            Recruiter
                        </option>
                    </select>
                </div>


                {/* REGISTER BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Register"}
                </button>

            </form>


            {/* SUCCESS MESSAGE */}

            {message && (
                <p>
                    {message}
                </p>
            )}


            {/* ERROR MESSAGE */}

            {error && (
                <p>
                    {error}
                </p>
            )}

        </div>
    );
};

export default Register;