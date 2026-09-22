import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        <div className="footer-logo-icon">
                            <i className="ri-check-double-line"></i>
                        </div>

                        <span>TaskFlow</span>
                    </Link>

                    <p>
                        A simple and powerful workspace to organize,
                        manage, and complete your tasks efficiently.
                    </p>

                    <div className="footer-socials">
                        <a href="https://github.com/anmolsharma079745" aria-label="GitHub"  target="_blank">
                            <i className="ri-github-fill"></i>
                        </a>

                        <a href="https://www.linkedin.com/in/anmol-1884a0317/" aria-label="LinkedIn"  target="_blank">
                            <i className="ri-linkedin-fill"></i>
                        </a>

                        <a href="mailto:asharma91975@gmail.com"  aria-label="Email" target ='_blank'>
        <i className="ri-mail-line"></i>
    </a>
                    </div>

                </div>


                <div className="footer-links">

                    <div className="footer-column">
                        <h3>Product</h3>

                        <Link to="/">Home</Link>
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                    </div>


                    <div className="footer-column">
                        <h3>Account</h3>

                        <Link to="/login">Login</Link>
                        <Link to="/register">Get Started</Link>
                    </div>


                    <div className="footer-column">
                        <h3>Features</h3>

                        <span>Task Management</span>
                        <span>Progress Tracking</span>
                        <span>Task Filtering</span>
                    </div>

                </div>

            </div>


            <div className="footer-bottom">

                <p>
                    © 2026 TaskFlow. All rights reserved.
                </p>


            </div>

        </footer>
    );
};

export default Footer;