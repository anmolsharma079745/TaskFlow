import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HomeSection.css";

const HomeSection = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const dashboardPath =
        user?.role === "admin" ? "/admin" : "/dashboard";

    return (
        <main>


            <section className="hero-section" id="home">

                <div className="hero-content">

                    <span className="hero-badge">
                        <i className="ri-sparkling-2-line"></i>
                        Smart Task Management
                    </span>

                    <h1>
                        Organize Your Work.
                        <br />
                        <span>Achieve More.</span>
                    </h1>

                    <p>
                        TaskFlow helps you create, organize, and track your
                        tasks in one simple and powerful workspace.
                    </p>

                    <div className="hero-buttons">

                        {user ? (

                            <Link to={dashboardPath}>
                                <button>
                                    Go to Dashboard
                                    <i className="ri-arrow-right-line"></i>
                                </button>
                            </Link>

                        ) : (

                            <>
                                <Link to="/register">
                                    <button>
                                        Get Started
                                        <i className="ri-arrow-right-line"></i>
                                    </button>
                                </Link>

                                <Link to="/login">
                                    <button>
                                        <i className="ri-login-box-line"></i>
                                        Login
                                    </button>
                                </Link>
                            </>

                        )}

                    </div>

                </div>

            </section>



            <section
                className="features-section"
                id="features"
            >

                <div className="section-heading">

                    <span>FEATURES</span>

                    <h2>
                        Everything You Need to Stay Productive
                    </h2>

                    <p>
                        Manage your daily work efficiently with powerful
                        task management features.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            <i className="ri-task-line"></i>
                        </div>

                        <h3>Create & Manage Tasks</h3>

                        <p>
                            Create tasks with descriptions, priorities,
                            categories, tags, and due dates.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <i className="ri-bar-chart-box-line"></i>
                        </div>

                        <h3>Track Your Progress</h3>

                        <p>
                            Keep track of pending, in-progress, and
                            completed tasks from your dashboard.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <i className="ri-shield-check-line"></i>
                        </div>

                        <h3>Secure Authentication</h3>

                        <p>
                            Your account and tasks are protected with
                            secure JWT-based authentication.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <i className="ri-flashlight-line"></i>
                        </div>

                        <h3>Stay Organized</h3>

                        <p>
                            Search, filter, and sort your tasks to quickly
                            find exactly what you need.
                        </p>

                    </div>

                </div>

            </section>



            <section
                className="how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Get Things Done in Three Simple Steps
                    </h2>

                </div>


                <div className="steps-grid">

                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            <i className="ri-add-circle-line"></i>
                        </div>

                        <h3>Create</h3>

                        <p>
                            Add your tasks and define their priority,
                            category, and deadline.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            <i className="ri-list-check-3"></i>
                        </div>

                        <h3>Organize</h3>

                        <p>
                            Search, filter, and manage your tasks according
                            to your workflow.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            <i className="ri-checkbox-circle-line"></i>
                        </div>

                        <h3>Complete</h3>

                        <p>
                            Update your progress and mark tasks as
                            completed when they're done.
                        </p>

                    </div>

                </div>

            </section>


            <section className="cta-section">
                <div className="cta-icon">
                    <i className="ri-rocket-line"></i>
                </div>
                <h2>
                    Ready to Take Control of Your Tasks?
                </h2>
                <p>
                    Start organizing your work and boost your productivity
                    with TaskFlow.
                </p>
                {user ? (
                    <Link to={dashboardPath}>
                        <button>
                            Go to Dashboard
                            <i className="ri-arrow-right-line"></i>
                        </button>
                    </Link>
                ) : (
                    <Link to="/register">
                        <button>
                            Start Managing Tasks
                            <i className="ri-arrow-right-line"></i>
                        </button>
                    </Link>
                )}
            </section>
            <div className="cta-bottom-space"></div>
        </main>
    );
};

export default HomeSection;