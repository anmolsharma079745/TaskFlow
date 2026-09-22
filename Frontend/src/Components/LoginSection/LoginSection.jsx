import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginSection.css";

const LoginSection = () => {

    const navigate = useNavigate();

    // Login states
    const [showPassword, setShowPassword] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Forgot password states
    const [forgotMode, setForgotMode] = useState(false);
    const [resetStep, setResetStep] = useState(1);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Common states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!loginEmail.trim() || !loginPassword) {
            setError("Please enter your email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: loginEmail.trim(),
                        password: loginPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }

            // Save token if backend returns one
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Save user if backend returns user
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            setSuccess("Login successful! Redirecting...");

            setTimeout(() => {
    navigate(
        data.user?.role === "admin"
            ? "/admin"
            : "/dashboard"
    );
}, 1000);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // FORGOT PASSWORD
    // STEP 1
    // =========================

    const handleSendCode = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to send reset code."
                );
            }

            setSuccess(
                "Reset code sent successfully! Check your email."
            );

            setResetStep(2);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // STEP 2 - VERIFY CODE
    // =========================

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!code.trim()) {
            setError("Please enter the reset code.");
            return;
        }

        if (code.length !== 6) {
            setError("Reset code must be 6 digits.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/verify-reset-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid or expired reset code."
                );
            }

            setSuccess("Reset code verified successfully!");

            setResetStep(3);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // STEP 3 - RESET PASSWORD
    // =========================

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                        password: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to reset password."
                );
            }

            setSuccess(
                "Password reset successfully! You can now sign in."
            );

            setTimeout(() => {
                handleBackToLogin();
            }, 1500);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // OPEN FORGOT PASSWORD
    // =========================

    const handleForgotPassword = () => {

        setForgotMode(true);
        setResetStep(1);

        setEmail(loginEmail);

        setCode("");
        setNewPassword("");
        setConfirmPassword("");

        setError("");
        setSuccess("");
    };


    // =========================
    // BACK TO LOGIN
    // =========================

    const handleBackToLogin = () => {

        setForgotMode(false);
        setResetStep(1);

        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");

        setError("");
        setSuccess("");
    };


    return (
        <main className="login-section">

            <div className="login-container">

                {/* =========================
                    LEFT SIDE
                ========================== */}

                <div className="login-info">

                    <Link to="/" className="login-logo">

                        <div className="login-logo-icon">
                            <i className="ri-check-double-line"></i>
                        </div>

                        <span>TaskFlow</span>

                    </Link>


                    <div className="login-info-content">

                        <span className="login-badge">

                            <i className="ri-shield-check-line"></i>

                            {forgotMode
                                ? "Account Recovery"
                                : "Secure Workspace"
                            }

                        </span>


                        <h1>

                            {forgotMode ? (
                                <>
                                    Reset Your
                                    <span> Password.</span>
                                </>
                            ) : (
                                <>
                                    Welcome
                                    <span> Back.</span>
                                </>
                            )}

                        </h1>


                        <p>

                            {forgotMode
                                ? "Don't worry, we'll help you get back into your TaskFlow account and continue managing your tasks."
                                : "Sign in to manage your tasks, track your progress, and stay organized with TaskFlow."
                            }

                        </p>

                    </div>

                </div>


                {/* =========================
                    RIGHT SIDE
                ========================== */}

                <div className="login-card">

                    {/* =========================
                        ERROR MESSAGE
                    ========================== */}

                    {error && (

                        <div className="auth-message error-message">

                            <i className="ri-error-warning-line"></i>

                            <span>{error}</span>

                        </div>

                    )}


                    {/* =========================
                        SUCCESS MESSAGE
                    ========================== */}

                    {success && (

                        <div className="auth-message success-message">

                            <i className="ri-checkbox-circle-line"></i>

                            <span>{success}</span>

                        </div>

                    )}


                    {/* ==================================================
                        NORMAL LOGIN
                    =================================================== */}

                    {!forgotMode && (

                        <>

                            <div className="login-card-header">

                                <h2>Sign In</h2>

                                <p>
                                    Enter your account details to continue.
                                </p>

                            </div>


                            <form
                                className="login-form"
                                onSubmit={handleLogin}
                            >

                                {/* EMAIL */}

                                <div className="form-group">

                                    <label htmlFor="loginEmail">
                                        Email Address
                                    </label>

                                    <div className="input-wrapper">

                                        

                                        <input
                                            type="email"
                                            id="loginEmail"
                                            placeholder="Enter your email"
                                            value={loginEmail}
                                            onChange={(e) =>
                                                setLoginEmail(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                {/* PASSWORD */}

                                <div className="form-group">

                                    <label htmlFor="loginPassword">
                                        Password
                                    </label>

                                    <div className="input-wrapper">

                                        

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="loginPassword"
                                            placeholder="Enter your password"
                                            value={loginPassword}
                                            onChange={(e) =>
                                                setLoginPassword(
                                                    e.target.value
                                                )
                                            }
                                            required
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
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
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


                                {/* OPTIONS */}

                                <div className="login-options">

                                    <label className="remember-me">

                                        <input
                                            type="checkbox"
                                            name="remember"
                                        />

                                        <span>
                                            Remember me
                                        </span>

                                    </label>


                                    <button
                                        type="button"
                                        className="forgot-password-link"
                                        onClick={
                                            handleForgotPassword
                                        }
                                    >
                                        Forgot Password?
                                    </button>

                                </div>


                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    className="login-submit"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <i className="ri-loader-4-line spin"></i>
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <i className="ri-arrow-right-line"></i>
                                        </>
                                    )}

                                </button>

                            </form>


                            <div className="login-divider">
                                <span>OR</span>
                            </div>


                            <p className="register-text">

                                Don't have an account?

                                <Link to="/register">
                                    Create an account
                                </Link>

                            </p>

                        </>

                    )}


                    {/* ==================================================
                        FORGOT PASSWORD
                    =================================================== */}

                    {forgotMode && (

                        <>

                            {/* STEP 1 */}

                            {resetStep === 1 && (

                                <>

                                    <div className="login-card-header">

                                        <div className="recovery-icon">
                                            <i className="ri-mail-send-line"></i>
                                        </div>

                                        <h2>
                                            Forgot Password?
                                        </h2>

                                        <p>
                                            Enter your registered email
                                            address and we'll send you a
                                            6-digit reset code.
                                        </p>

                                    </div>


                                    <form
                                        className="login-form"
                                        onSubmit={handleSendCode}
                                    >

                                        <div className="form-group">

                                            <label htmlFor="resetEmail">
                                                Email Address
                                            </label>

                                            <div className="input-wrapper">


                                                <input
                                                    type="email"
                                                    id="resetEmail"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>


                                        <button
                                            type="submit"
                                            className="login-submit"
                                            disabled={loading}
                                        >

                                            {loading ? (
                                                <>
                                                    <i className="ri-loader-4-line spin"></i>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Reset Code
                                                    <i className="ri-arrow-right-line"></i>
                                                </>
                                            )}

                                        </button>


                                        <button
                                            type="button"
                                            className="back-step-button"
                                            onClick={
                                                handleBackToLogin
                                            }
                                        >
                                            <i className="ri-arrow-left-line"></i>
                                            Back to Login
                                        </button>

                                    </form>

                                </>

                            )}


                            {/* STEP 2 */}

                            {resetStep === 2 && (

                                <>

                                    <div className="login-card-header">

                                        <div className="recovery-icon">
                                            <i className="ri-shield-keyhole-line"></i>
                                        </div>

                                        <h2>
                                            Verify Reset Code
                                        </h2>

                                        <p>
                                            Enter the 6-digit code sent
                                            to your registered email.
                                        </p>

                                    </div>


                                    <form
                                        className="login-form"
                                        onSubmit={handleVerifyCode}
                                    >

                                        <div className="form-group">

                                            <label htmlFor="resetCode">
                                                Reset Code
                                            </label>

                                            <div className="input-wrapper">

                                                

                                                <input
                                                    type="text"
                                                    id="resetCode"
                                                    placeholder="Enter 6-digit code"
                                                    value={code}
                                                    maxLength="6"
                                                    inputMode="numeric"
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            );

                                                        setCode(value);

                                                    }}
                                                    required
                                                />

                                            </div>

                                        </div>


                                        <button
                                            type="submit"
                                            className="login-submit"
                                            disabled={loading}
                                        >

                                            {loading ? (
                                                <>
                                                    <i className="ri-loader-4-line spin"></i>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    Verify Code
                                                    <i className="ri-arrow-right-line"></i>
                                                </>
                                            )}

                                        </button>


                                        <button
                                            type="button"
                                            className="back-step-button"
                                            onClick={() => {

                                                setResetStep(1);
                                                setCode("");
                                                setError("");
                                                setSuccess("");

                                            }}
                                        >
                                            <i className="ri-arrow-left-line"></i>
                                            Change Email
                                        </button>

                                    </form>

                                </>

                            )}


                            {/* STEP 3 */}

                            {resetStep === 3 && (

                                <>

                                    <div className="login-card-header">

                                        <div className="recovery-icon">
                                            <i className="ri-lock-password-line"></i>
                                        </div>

                                        <h2>
                                            Create New Password
                                        </h2>

                                        <p>
                                            Create a new password for
                                            your TaskFlow account.
                                        </p>

                                    </div>


                                    <form
                                        className="login-form"
                                        onSubmit={handleResetPassword}
                                    >

                                        {/* NEW PASSWORD */}

                                        <div className="form-group">

                                            <label htmlFor="newPassword">
                                                New Password
                                            </label>

                                            <div className="input-wrapper">


                                                <input
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    id="newPassword"
                                                    placeholder="Enter new password"
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    aria-label={
                                                        showNewPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                >

                                                    <i
                                                        className={
                                                            showNewPassword
                                                                ? "ri-eye-off-line"
                                                                : "ri-eye-line"
                                                        }
                                                    ></i>

                                                </button>

                                            </div>

                                        </div>


                                        {/* CONFIRM PASSWORD */}

                                        <div className="form-group">

                                            <label htmlFor="confirmPassword">
                                                Confirm Password
                                            </label>

                                            <div className="input-wrapper">


                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    id="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
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
                                            className="login-submit"
                                            disabled={loading}
                                        >

                                            {loading ? (
                                                <>
                                                    <i className="ri-loader-4-line spin"></i>
                                                    Resetting...
                                                </>
                                            ) : (
                                                <>
                                                    Reset Password
                                                    <i className="ri-check-line"></i>
                                                </>
                                            )}

                                        </button>


                                        <button
                                            type="button"
                                            className="back-step-button"
                                            onClick={() => {

                                                setResetStep(2);
                                                setError("");
                                                setSuccess("");

                                            }}
                                        >
                                            <i className="ri-arrow-left-line"></i>
                                            Back to Code
                                        </button>

                                    </form>

                                </>

                            )}


                            <div className="login-divider">
                                <span>OR</span>
                            </div>


                            <p className="register-text">

                                Remember your password?

                                <button
                                    type="button"
                                    className="back-login-button"
                                    onClick={handleBackToLogin}
                                >
                                    Sign in
                                </button>

                            </p>

                        </>

                    )}

                </div>

            </div>

        </main>
    );
};

export default LoginSection;