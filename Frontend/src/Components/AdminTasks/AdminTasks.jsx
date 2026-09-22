import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminTasks.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminTasks = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "",
        category: "",
        tags: "",
        dueDate: ""
    });

    const fetchTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/getAllTasks`,
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
                    data.message || "Failed to fetch tasks"
                );
            }

            setTasks(data.tasks || []);

        } catch (err) {

            console.error("Fetch Tasks Error:", err);

            setError(
                err.message || "Failed to fetch tasks"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEditClick = (task) => {

        setSelectedTask(task);

        setEditForm({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "Pending",
            priority: task.priority || "",
            category: task.category || "",
            tags: Array.isArray(task.tags)
                ? task.tags.join(", ")
                : task.tags || "",
            dueDate: task.dueDate
                ? new Date(task.dueDate)
                    .toISOString()
                    .split("T")[0]
                : ""
        });

        setShowEditModal(true);
    };

    const handleEditChange = (e) => {

        const { name, value } = e.target;

        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateTask = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const updatedTask = {
                ...editForm,
                tags: editForm.tags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag !== "")
            };

            const response = await fetch(
                `${API_BASE_URL}/api/admin/updateTask/${selectedTask._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedTask)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update task"
                );
            }

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === selectedTask._id
                        ? data.task
                        : task
                )
            );

            setShowEditModal(false);
            setSelectedTask(null);

        } catch (err) {

            console.error("Update Task Error:", err);

            setError(
                err.message || "Failed to update task"
            );
        }
    };

    const handleDeleteTask = async (taskId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/deleteTask/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete task"
                );
            }

            setTasks(prevTasks =>
                prevTasks.filter(
                    task => task._id !== taskId
                )
            );

        } catch (err) {

            console.error("Delete Task Error:", err);

            setError(
                err.message || "Failed to delete task"
            );
        }
    };

    const filteredTasks = tasks.filter(task => {

        const searchValue = search.toLowerCase();

        const matchesSearch =
            task.title?.toLowerCase().includes(searchValue) ||
            task.description?.toLowerCase().includes(searchValue) ||
            task.category?.toLowerCase().includes(searchValue) ||
            task.userId?.name?.toLowerCase().includes(searchValue) ||
            task.userId?.email?.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            task.status === statusFilter;

        const matchesPriority =
            priorityFilter === "All" ||
            task.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    const getStatusClass = (status) => {

        if (status === "Completed") {
            return "completed-status";
        }

        if (status === "In Progress") {
            return "progress-status";
        }

        return "pending-status";
    };

    const getPriorityClass = (priority) => {

        if (priority === "High") {
            return "high-priority";
        }

        if (priority === "Medium") {
            return "medium-priority";
        }

        if (priority === "Low") {
            return "low-priority";
        }

        return "";
    };

    return (
        <div className="admin-tasks-page">

            <div className="admin-tasks-container">


                <div className="admin-tasks-header">

                    <div>

                        <Link
                            to="/admin"
                            className="admin-back-link"
                        >
                            <i className="ri-arrow-left-line"></i>
                            Back to Dashboard
                        </Link>

                        <p className="admin-page-label">
                            Administration
                        </p>

                        <h1>
                            Manage Tasks
                        </h1>

                        <p className="admin-page-description">
                            View and manage all tasks created by TaskFlow users.
                        </p>

                    </div>

                    <div className="admin-task-count">

                        <i className="ri-task-line"></i>

                        <div>

                            <span>
                                Total Tasks
                            </span>

                            <strong>
                                {tasks.length}
                            </strong>

                        </div>

                    </div>

                </div>


                {error && (

                    <div className="admin-tasks-error">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                        <button onClick={fetchTasks}>
                            Retry
                        </button>

                    </div>

                )}


                <div className="admin-tasks-toolbar">


                    <div className="admin-task-search">

                        <i className="ri-search-line"></i>

                        <input
                            type="text"
                            placeholder="Search tasks, users or categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (

                            <button
                                className="task-clear-search"
                                onClick={() => setSearch("")}
                            >
                                <i className="ri-close-line"></i>
                            </button>

                        )}

                    </div>


                    <div className="admin-filter-box">

                        <i className="ri-list-check-2"></i>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                        </select>

                    </div>


                    <div className="admin-filter-box">

                        <i className="ri-flag-line"></i>

                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }
                        >

                            <option value="All">
                                All Priority
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Low">
                                Low
                            </option>

                        </select>

                    </div>

                </div>


                <div className="admin-tasks-card">

                    {loading ? (

                        <div className="admin-tasks-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading tasks...
                            </p>

                        </div>

                    ) : filteredTasks.length === 0 ? (

                        <div className="admin-tasks-empty">

                            <div className="admin-empty-icon">

                                <i className="ri-task-line"></i>

                            </div>

                            <h3>
                                {search ||
                                statusFilter !== "All" ||
                                priorityFilter !== "All"
                                    ? "No Tasks Found"
                                    : "No Tasks Available"}
                            </h3>

                            <p>
                                {search ||
                                statusFilter !== "All" ||
                                priorityFilter !== "All"
                                    ? "Try changing your search or filters."
                                    : "Created tasks will appear here."}
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-tasks-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Task
                                        </th>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Due Date
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredTasks.map(task => (

                                        <tr key={task._id}>


                                            <td>

                                                <div className="task-info">

                                                    <div className="task-icon">

                                                        <i className="ri-task-line"></i>

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {task.title}
                                                        </strong>

                                                        <span>
                                                            ID:{" "}
                                                            {task._id.slice(-6)}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="task-user-info">

                                                    <strong>
                                                        {task.userId?.name ||
                                                            "Unknown User"}
                                                    </strong>

                                                    <span>
                                                        {task.userId?.email ||
                                                            "No email"}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={`task-status ${getStatusClass(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`task-priority ${getPriorityClass(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority ||
                                                        "Not Set"}
                                                </span>

                                            </td>


                                            <td>

                                                <span className="task-due-date">

                                                    {task.dueDate
                                                        ? new Date(
                                                              task.dueDate
                                                          ).toLocaleDateString()
                                                        : "No due date"}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="task-actions">

                                                    <button
                                                        className="task-action-btn edit-task-btn"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                task
                                                            )
                                                        }
                                                        title="Edit Task"
                                                    >
                                                        <i className="ri-edit-line"></i>
                                                    </button>

                                                    <button
                                                        className="task-action-btn delete-task-btn"
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                task._id
                                                            )
                                                        }
                                                        title="Delete Task"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>


            {showEditModal && selectedTask && (

                <div className="admin-modal-overlay">

                    <div className="admin-task-edit-modal">

                        <div className="admin-modal-header">

                            <div>

                                <span>
                                    Edit Task
                                </span>

                                <h2>
                                    Update Task Details
                                </h2>

                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTask(null);
                                }}
                            >
                                <i className="ri-close-line"></i>
                            </button>

                        </div>

                        <form onSubmit={handleUpdateTask}>


                            <div className="admin-form-group">

                                <label>
                                    Task Title
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-task-line"></i>

                                    <input
                                        type="text"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Description
                                </label>

                                <div className="admin-input-wrapper textarea-wrapper">

                                    <i className="ri-file-text-line"></i>

                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        rows="3"
                                    />

                                </div>

                            </div>


                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <div className="admin-input-wrapper">

                                        <i className="ri-list-check-2"></i>

                                        <select
                                            name="status"
                                            value={editForm.status}
                                            onChange={handleEditChange}
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="In Progress">
                                                In Progress
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                        </select>

                                    </div>

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <div className="admin-input-wrapper">

                                        <i className="ri-flag-line"></i>

                                        <select
                                            name="priority"
                                            value={editForm.priority}
                                            onChange={handleEditChange}
                                        >

                                            <option value="">
                                                Select Priority
                                            </option>

                                            <option value="Low">
                                                Low
                                            </option>

                                            <option value="Medium">
                                                Medium
                                            </option>

                                            <option value="High">
                                                High
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Category
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-price-tag-3-line"></i>

                                    <input
                                        type="text"
                                        name="category"
                                        value={editForm.category}
                                        onChange={handleEditChange}
                                        placeholder="e.g. Development"
                                    />

                                </div>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Tags
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-hashtag"></i>

                                    <input
                                        type="text"
                                        name="tags"
                                        value={editForm.tags}
                                        onChange={handleEditChange}
                                        placeholder="react, node, mongodb"
                                    />

                                </div>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Due Date
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-calendar-line"></i>

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={editForm.dueDate}
                                        onChange={handleEditChange}
                                    />

                                </div>

                            </div>


                            <div className="admin-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedTask(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-update-btn"
                                >

                                    <i className="ri-save-line"></i>

                                    Update Task

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminTasks;