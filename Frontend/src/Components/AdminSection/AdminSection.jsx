import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminSection.css";

const AdminSection = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
    });

    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activityLoading, setActivityLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login to access admin dashboard.");
            }

            const response = await fetch(
                "http://localhost:3000/api/admin/getDashboardStats",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch dashboard stats"
                );
            }

            setStats(
                data.stats || {
                    totalUsers: 0,
                    totalTasks: 0,
                    pendingTasks: 0,
                    completedTasks: 0,
                    inProgressTasks: 0
                }
            );
        } catch (err) {
            console.error("Dashboard Stats Error:", err);
            setError(
                err.message || "Failed to fetch dashboard stats"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentTasks = async () => {
        try {
            setActivityLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            const response = await fetch(
                "http://localhost:3000/api/admin/getAllTasks?sortBy=createdAt&order=desc&page=1&limit=5",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch recent tasks"
                );
            }

            setRecentTasks(
                Array.isArray(data.tasks) ? data.tasks : []
            );
        } catch (err) {
            console.error("Recent Tasks Error:", err);
            setRecentTasks([]);
        } finally {
            setActivityLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
        fetchRecentTasks();
    }, []);

    const formatActivityDate = (date) => {
        if (!date) {
            return "Recently";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="admin-dashboard">
            <main className="admin-main">

                <div className="admin-topbar">
                    <div>
                        <p className="admin-welcome-text">
                            Welcome back,
                            <span> {user.name || "Admin"}!</span>
                        </p>

                        <h1>Admin Dashboard</h1>
                    </div>

                    <div className="admin-profile">
                        <div className="admin-profile-icon">
                            <i className="ri-admin-line"></i>
                        </div>

                        <div>
                            <span>
                                {user.name || "Administrator"}
                            </span>

                            <small>Admin</small>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="admin-error">
                        <i className="ri-error-warning-line"></i>
                        <span>{error}</span>
                    </div>
                )}

                <section className="admin-stats">

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon users-icon">
                            <i className="ri-group-line"></i>
                        </div>

                        <div className="admin-stat-content">
                            <span>Total Users</span>

                            <h2>
                                {loading ? "..." : stats.totalUsers}
                            </h2>

                            <p>Registered users</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon tasks-icon">
                            <i className="ri-task-line"></i>
                        </div>

                        <div className="admin-stat-content">
                            <span>Total Tasks</span>

                            <h2>
                                {loading ? "..." : stats.totalTasks}
                            </h2>

                            <p>All created tasks</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon pending-icon">
                            <i className="ri-time-line"></i>
                        </div>

                        <div className="admin-stat-content">
                            <span>Pending Tasks</span>

                            <h2>
                                {loading ? "..." : stats.pendingTasks}
                            </h2>

                            <p>Tasks waiting to start</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon completed-icon">
                            <i className="ri-checkbox-circle-line"></i>
                        </div>

                        <div className="admin-stat-content">
                            <span>Completed Tasks</span>

                            <h2>
                                {loading ? "..." : stats.completedTasks}
                            </h2>

                            <p>Successfully completed</p>
                        </div>
                    </div>

                </section>

                <section className="admin-management">

                    <div className="admin-section-heading">
                        <div>
                            <span>Management</span>
                            <h2>Manage TaskFlow</h2>
                        </div>

                        <p>
                            Manage users and tasks from one central dashboard.
                        </p>
                    </div>

                    <div className="admin-management-grid">

                        <div className="admin-management-card">
                            <div className="management-card-icon">
                                <i className="ri-user-3-line"></i>
                            </div>

                            <div className="management-card-content">
                                <h3>Manage Users</h3>

                                <p>
                                    View, update and manage all registered
                                    TaskFlow users.
                                </p>

                                <Link
                                    to="/admin/users"
                                    className="management-btn"
                                >
                                    View Users
                                    <i className="ri-arrow-right-line"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="admin-management-card">
                            <div className="management-card-icon">
                                <i className="ri-list-check-3"></i>
                            </div>

                            <div className="management-card-content">
                                <h3>Manage Tasks</h3>

                                <p>
                                    Monitor and manage tasks created by
                                    all users.
                                </p>

                                <Link
                                    to="/admin/tasks"
                                    className="management-btn"
                                >
                                    View Tasks
                                    <i className="ri-arrow-right-line"></i>
                                </Link>
                            </div>
                        </div>

                    </div>

                </section>

                <section className="admin-activity">

                    <div className="admin-section-heading">
                        <div>
                            <span>Overview</span>
                            <h2>Recent Activity</h2>
                        </div>
                    </div>

                    <div className="admin-activity-list">

                        {activityLoading ? (
                            <div className="admin-empty-state">
                                <div className="empty-state-icon">
                                    <i className="ri-loader-4-line"></i>
                                </div>

                                <h3>Loading Activity</h3>

                                <p>
                                    Fetching recent task activity...
                                </p>
                            </div>
                        ) : recentTasks.length === 0 ? (
                            <div className="admin-empty-state">
                                <div className="empty-state-icon">
                                    <i className="ri-bar-chart-box-line"></i>
                                </div>

                                <h3>No Recent Activity</h3>

                                <p>
                                    Recent task activity will appear here.
                                </p>
                            </div>
                        ) : (
                            recentTasks.map((task) => (
                                <div
                                    className="admin-activity-item"
                                    key={task._id}
                                >
                                    <div className="activity-icon">
                                        <i className="ri-task-line"></i>
                                    </div>

                                    <div className="activity-content">
                                        <h3>New task created</h3>

                                        <p>
                                            <strong>
                                                {task.userId?.name || "User"}
                                            </strong>

                                            {" created "}

                                            <strong>
                                                "{task.title}"
                                            </strong>
                                        </p>
                                    </div>

                                    <span className="activity-time">
                                        {formatActivityDate(
                                            task.createdAt
                                        )}
                                    </span>
                                </div>
                            ))
                        )}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default AdminSection;
