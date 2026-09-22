import { useEffect, useState } from "react";
import "./TaskSection.css";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ;

const TaskSection = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
    });

    const getToken = () => {
        return localStorage.getItem("token");
    };


    const fetchTasks = async () => {
        setLoading(true);
        setError("");

        try {
            const token = getToken();

            if (!token) {
                setError("Please login to manage your tasks.");
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

            const fetchedTasks = Array.isArray(data)
                ? data
                : data.tasks || data.data || [];

            setTasks(fetchedTasks);
        } catch (error) {
            setError(
                error.message ||
                    "Something went wrong while loading tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);


    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        try {
            const token = getToken();

            if (!token) {
                setError("Please login first.");
                return;
            }

            const url = editingTask
                ? `${API_BASE_URL}/api/task/update-Task/${editingTask._id}`
                : `${API_BASE_URL}/api/task/createTask`;

            const method = editingTask ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        `Failed to ${
                            editingTask ? "update" : "create"
                        } task.`
                );
            }

            setMessage(
                editingTask
                    ? "Task updated successfully."
                    : "Task created successfully."
            );

            resetForm();
            fetchTasks();
        } catch (error) {
            setError(
                error.message ||
                    "Something went wrong. Please try again."
            );
        }
    };


    const handleEdit = (task) => {
        setEditingTask(task);

        setFormData({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "Pending",
            priority: task.priority || "Medium",
            dueDate: task.dueDate
                ? task.dueDate.split("T")[0]
                : "",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleDelete = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        setError("");
        setMessage("");

        try {
            const token = getToken();

            if (!token) {
                setError("Please login first.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/task/deleteTask/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete task."
                );
            }

            setMessage("Task deleted successfully.");

            fetchTasks();
        } catch (error) {
            setError(
                error.message ||
                    "Something went wrong while deleting the task."
            );
        }
    };


    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            status: "Pending",
            priority: "Medium",
            dueDate: "",
        });

        setEditingTask(null);
        setShowForm(false);
    };


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
        if (priority === "High") {
            return "priority-high";
        }

        if (priority === "Low") {
            return "priority-low";
        }

        return "priority-medium";
    };

    return (
        <main className="task-section">
            <div className="task-container">


                <section className="task-page-header">
                    <div>
                        <span className="task-page-label">
                            <i className="ri-task-line"></i>
                            TASK MANAGEMENT
                        </span>

                        <h1>My Tasks</h1>

                        <p>
                            Create, organize, and manage your tasks
                            efficiently from one place.
                        </p>
                    </div>

                    <button
                        className="create-task-btn"
                        onClick={() => {
                            setEditingTask(null);
                            setFormData({
                                title: "",
                                description: "",
                                status: "Pending",
                                priority: "Medium",
                                dueDate: "",
                            });
                            setShowForm(true);
                        }}
                    >
                        <i className="ri-add-line"></i>
                        Create New Task
                    </button>
                </section>


                {error && (
                    <div className="task-message error-message">
                        <i className="ri-error-warning-line"></i>
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="task-message success-message">
                        <i className="ri-checkbox-circle-line"></i>
                        <span>{message}</span>
                    </div>
                )}


                {showForm && (
                    <section className="task-form-card">

                        <div className="task-form-header">
                            <div>
                                <span className="form-label">
                                    {editingTask
                                        ? "UPDATE TASK"
                                        : "NEW TASK"}
                                </span>

                                <h2>
                                    {editingTask
                                        ? "Edit Task"
                                        : "Create a New Task"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="close-form-btn"
                                onClick={resetForm}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <form
                            className="task-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group full-width">
                                <label htmlFor="title">
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your task..."
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
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

                            <div className="form-group">
                                <label htmlFor="priority">
                                    Priority
                                </label>

                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
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

                            <div className="form-group">
                                <label htmlFor="dueDate">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-task-btn"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-task-btn"
                                >
                                    <i
                                        className={
                                            editingTask
                                                ? "ri-save-line"
                                                : "ri-add-line"
                                        }
                                    ></i>

                                    {editingTask
                                        ? "Update Task"
                                        : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}


                <section className="tasks-section">

                    <div className="tasks-section-header">
                        <div>
                            <span className="task-section-label">
                                YOUR WORKSPACE
                            </span>

                            <h2>All Tasks</h2>

                            <p>
                                View and manage all the tasks you
                                have created.
                            </p>
                        </div>

                        <div className="task-count">
                            <span>{tasks.length}</span>
                            Tasks
                        </div>
                    </div>

                    {loading ? (
                        <div className="task-empty-state">
                            <div className="loading-spinner"></div>
                            <p>Loading your tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="task-empty-state">
                            <div className="empty-task-icon">
                                <i className="ri-task-line"></i>
                            </div>

                            <h3>No Tasks Yet</h3>

                            <p>
                                You haven't created any tasks yet.
                                Start by creating your first task.
                            </p>

                            <button
                                className="empty-create-btn"
                                onClick={() => setShowForm(true)}
                            >
                                <i className="ri-add-line"></i>
                                Create Your First Task
                            </button>
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {tasks.map((task) => (
                                <article
                                    className="task-card"
                                    key={task._id}
                                >
                                    <div className="task-card-top">
                                        <div className="task-card-icon">
                                            <i className="ri-checkbox-blank-circle-line"></i>
                                        </div>

                                        <div className="task-card-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(task)
                                                }
                                                title="Edit Task"
                                            >
                                                <i className="ri-edit-line"></i>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        task._id
                                                    )
                                                }
                                                title="Delete Task"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="task-card-content">
                                        <h3>{task.title}</h3>

                                        <p>
                                            {task.description ||
                                                "No description available."}
                                        </p>
                                    </div>

                                    <div className="task-card-meta">
                                        <span
                                            className={`task-status ${getStatusClass(
                                                task.status
                                            )}`}
                                        >
                                            {task.status || "Pending"}
                                        </span>

                                        <span
                                            className={`task-priority ${getPriorityClass(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority ||
                                                "Medium"}
                                        </span>
                                    </div>

                                    {task.dueDate && (
                                        <div className="task-card-date">
                                            <i className="ri-calendar-line"></i>

                                            <span>
                                                Due:{" "}
                                                {new Date(
                                                    task.dueDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default TaskSection;