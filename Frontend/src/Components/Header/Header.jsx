import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {

    const [user, setUser] = useState(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setShowLogoutPopup(false);

        navigate("/login");
    };

    const handleHomeClick = () => {
        navigate("/");

        setTimeout(() => {
            document.getElementById("home")?.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    };

    return (
        <>
            <header className="header">

                <div className="header-container">

                    <div className="header-logo">

                        <Link to="/" className="header-logo-link">

                            <div className="logo-icon"> 
                                <img src="/Task%20Flow%20symbol.png" alt="TaskFlow Logo" /> 
                            </div>

                            <span>TaskFlow</span>

                        </Link>

                    </div>


                    <div className="navbar">

                        <button
                            onClick={handleHomeClick}
                            className="nav-link home-nav-button"
                        >
                            Home
                        </button>

                        <button
    onClick={() => {
        navigate("/");
        setTimeout(() => {
            document.getElementById("features")?.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    }}
    className="nav-link nav-scroll-button"
>
    Features
</button>

<button
    onClick={() => {
        navigate("/");
        setTimeout(() => {
            document.getElementById("how-it-works")?.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    }}
    className="nav-link nav-scroll-button"
>
    How It Works
</button>

                    </div>


                    <div className="header-actions">

                        <button
                            className="login-link user-menu-button"
                            onClick={() => setShowLogoutPopup(true)}
                        >
                            {user?.name || "Login"}

                            <i className="ri-arrow-down-s-line"></i>
                        </button>

                        {user ? (
                            <Link
                                to="/profile"
                                className="register-button"
                            >
                                Profile
                                <i className="ri-user-line"></i>
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="register-button"
                            >
                                Get Started
                                <i className="ri-arrow-right-line"></i>
                            </Link>
                        )}

                    </div>

                </div>

            </header>


            {showLogoutPopup && (
                <div className="logout-overlay">

                    <div className="logout-popup">

                        <div className="logout-icon">
                            <i className="ri-logout-box-r-line"></i>
                        </div>

                        <h3>Logout?</h3>

                        <p>
                            Are you sure you want to logout from TaskFlow?
                        </p>

                        <div className="logout-actions">

                            <button
                                className="cancel-button"
                                onClick={() => setShowLogoutPopup(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                                <i className="ri-logout-box-r-line"></i>
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
};

export default Header;