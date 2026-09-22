import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDashBoard.css";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const UserDashboardSection = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const fetchTasks = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your dashboard.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/task/myAllTasks`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch tasks."
                );
            }

            const fetchedTasks =
                Array.isArray(data)
                    ? data
                    : data.tasks || data.data || [];

            setTasks(fetchedTasks);

        } catch (error) {
            setError(
                error.message || "Something went wrong while loading tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "Pending"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const recentTasks = [...tasks]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);

            return dateB - dateA;
        })
        .slice(0, 5);

    const getStatusClass = (status) => {
        if (status === "Completed") {
            return "status-completed";
        }

        if (status === "In Progress") {
            return "status-progress";
        }

        return "status-pending";
    };

    const getPriorityClass = (priority) => {
        if (!priority) {
            return "priority-medium";
        }

        return `priority-${priority.toLowerCase()}`;
    };

    return (
        <main className="user-dashboard">

            <div className="dashboard-container">

                {/* Welcome Section */}
                <section className="dashboard-welcome">

                    <div className="welcome-content">

                        <span className="welcome-badge">
                            <i className="ri-dashboard-line"></i>
                            User Dashboard
                        </span>

                        <h1>
                            Welcome back,
                            <span> {user.name || "User"}!</span>
                        </h1>

                        <p>
                            Stay organized, track your progress, and
                            get your tasks done efficiently.
                        </p>

                    </div>

                    <Link
                        to="/tasks"
                        className="create-task-button"
                    >
                        <i className="ri-add-line"></i>
                        Create New Task
                    </Link>

                </section>


                {/* Error */}
                {error && (
                    <div className="dashboard-message error-message">
                        <i className="ri-error-warning-line"></i>
                        <span>{error}</span>
                    </div>
                )}


                {/* Statistics */}
                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon total-icon">
                            <i className="ri-task-line"></i>
                        </div>

                        <div className="stat-info">
                            <span>Total Tasks</span>

                            <h2>
                                {loading ? "..." : totalTasks}
                            </h2>

                            <p>All your tasks</p>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon pending-icon">
                            <i className="ri-time-line"></i>
                        </div>

                        <div className="stat-info">
                            <span>Pending</span>

                            <h2>
                                {loading ? "..." : pendingTasks}
                            </h2>

                            <p>Tasks waiting</p>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon progress-icon">
                            <i className="ri-loader-4-line"></i>
                        </div>

                        <div className="stat-info">
                            <span>In Progress</span>

                            <h2>
                                {loading ? "..." : inProgressTasks}
                            </h2>

                            <p>Currently working</p>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon completed-icon">
                            <i className="ri-checkbox-circle-line"></i>
                        </div>

                        <div className="stat-info">
                            <span>Completed</span>

                            <h2>
                                {loading ? "..." : completedTasks}
                            </h2>

                            <p>Tasks completed</p>
                        </div>

                    </div>

                </section>


                {/* Recent Tasks */}
                <section className="recent-tasks-section">

                    <div className="section-header">

                        <div>
                            <span className="section-label">
                                YOUR WORK
                            </span>

                            <h2>Recent Tasks</h2>

                            <p>
                                Keep track of your latest tasks and progress.
                            </p>
                        </div>

                        <Link
                            to="/tasks"
                            className="view-all-button"
                        >
                            View All
                            <i className="ri-arrow-right-line"></i>
                        </Link>

                    </div>


                    <div className="tasks-container">

                        {loading ? (

                            <div className="empty-state">
                                <div className="loading-spinner"></div>
                                <p>Loading your tasks...</p>
                            </div>

                        ) : recentTasks.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    <i className="ri-task-line"></i>
                                </div>

                                <h3>No Tasks Yet</h3>

                                <p>
                                    You haven't created any tasks yet.
                                    Start by creating your first task.
                                </p>

                                <Link
                                    to="/tasks"
                                    className="empty-action"
                                >
                                    <i className="ri-add-line"></i>
                                    Create Your First Task
                                </Link>

                            </div>

                        ) : (

                            <div className="tasks-list">

                                {recentTasks.map((task) => (

                                    <div
                                        className="task-row"
                                        key={task._id}
                                    >

                                        <div className="task-main">

                                            <div className="task-icon">
                                                <i className="ri-checkbox-blank-circle-line"></i>
                                            </div>

                                            <div className="task-details">

                                                <h3>
                                                    {task.title}
                                                </h3>

                                                <p>
                                                    {task.description ||
                                                        "No description available."}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="task-meta">

                                            <span
                                                className={`task-status ${getStatusClass(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status || "Pending"}
                                            </span>

                                            {task.priority && (
                                                <span
                                                    className={`task-priority ${getPriorityClass(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            )}

                                            {task.dueDate && (
                                                <span className="task-date">
                                                    <i className="ri-calendar-line"></i>
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </section>


                {/* Quick Actions */}
                <section className="quick-actions-section">

                    <div className="section-header">

                        <div>
                            <span className="section-label">
                                QUICK ACTIONS
                            </span>

                            <h2>Manage Your Workspace</h2>

                            <p>
                                Quickly access the tools you use most.
                            </p>
                        </div>

                    </div>


                    <div className="quick-actions-grid">

                        <Link
                            to="/tasks"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="ri-list-check-3"></i>
                            </div>

                            <div>
                                <h3>My Tasks</h3>
                                <p>
                                    View and manage all your tasks.
                                </p>
                            </div>

                            <i className="ri-arrow-right-line quick-arrow"></i>
                        </Link>


                        <Link
                            to="/tasks"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="ri-add-circle-line"></i>
                            </div>

                            <div>
                                <h3>Create Task</h3>
                                <p>
                                    Add a new task to your workspace.
                                </p>
                            </div>

                            <i className="ri-arrow-right-line quick-arrow"></i>
                        </Link>


                        <Link
                            to="/profile"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="ri-user-settings-line"></i>
                            </div>

                            <div>
                                <h3>My Profile</h3>
                                <p>
                                    View and update your account.
                                </p>
                            </div>

                            <i className="ri-arrow-right-line quick-arrow"></i>
                        </Link>

                    </div>

                </section>

            </div>

        </main>
    );
};

export default UserDashboardSection;