import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegistrationSection.css";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ;

const RegistrationSection = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed. Please try again."
                );
            }

            setSuccess(
                data.message || "Account created successfully!"
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="registration-section">

            <div className="registration-container">

                <div className="registration-info">

                    <Link to="/" className="registration-logo">

                        <div className="registration-logo-icon">
                            <i className="ri-check-double-line"></i>
                        </div>

                        <span>TaskFlow</span>

                    </Link>

                    <div className="registration-info-content">

                        <span className="registration-badge">
                            <i className="ri-user-add-line"></i>
                            Create Your Workspace
                        </span>

                        <h1>
                            Start Your
                            <span> Journey.</span>
                        </h1>

                        <p>
                            Create your TaskFlow account and start organizing
                            your tasks, tracking progress, and staying productive.
                        </p>

                    </div>

                </div>

                <div className="registration-card">

                    <div className="registration-card-header">

                        <h2>Create Account</h2>

                        <p>
                            Enter your details to get started with TaskFlow.
                        </p>

                    </div>

                    {error && (
                        <div className="auth-message error-message">
                            <i className="ri-error-warning-line"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-message success-message">
                            <i className="ri-checkbox-circle-line"></i>
                            <span>{success}</span>
                        </div>
                    )}

                    <form
                        className="registration-form"
                        onSubmit={handleRegister}
                    >

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <div className="input-wrapper">

                                <i className="ri-user-line"></i>

                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <i className="ri-mail-line"></i>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <i className="ri-lock-line"></i>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={loading}
                                >
                                    <i
                                        className={
                                            showPassword
                                                ? "ri-eye-off-line"
                                                : "ri-eye-line"
                                        }
                                    ></i>
                                </button>

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="input-wrapper">

                                <i className="ri-lock-password-line"></i>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    disabled={loading}
                                >
                                    <i
                                        className={
                                            showConfirmPassword
                                                ? "ri-eye-off-line"
                                                : "ri-eye-line"
                                        }
                                    ></i>
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="registration-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Creating Account
                                    <i className="ri-loader-4-line spin"></i>
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <i className="ri-arrow-right-line"></i>
                                </>
                            )}
                        </button>

                    </form>

                    <div className="registration-divider">
                        <span>OR</span>
                    </div>

                    <p className="login-text">

                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
};

export default RegistrationSection;