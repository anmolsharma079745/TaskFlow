import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminMAnageUserSection.css";

const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        role: ""
    });


    /* ================================
       FETCH ALL USERS
    ================================= */

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/admin/getAllUsers",
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
                    data.message || "Failed to fetch users"
                );
            }

            setUsers(data.users || []);

        } catch (err) {

            console.error("Fetch Users Error:", err);

            setError(
                err.message || "Failed to fetch users"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);


    /* ================================
       EDIT USER
    ================================= */

    const handleEditClick = (user) => {

        setSelectedUser(user);

        setEditForm({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user"
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


    /* ================================
       UPDATE USER
    ================================= */

    const handleUpdateUser = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/admin/updateUser/${selectedUser._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(editForm)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update user"
                );
            }

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === selectedUser._id
                        ? data.user
                        : user
                )
            );

            setShowEditModal(false);
            setSelectedUser(null);

        } catch (err) {

            console.error("Update User Error:", err);

            setError(
                err.message || "Failed to update user"
            );

        }
    };


    /* ================================
       DELETE USER
    ================================= */

    const handleDeleteUser = async (userId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/admin/deleteUser/${userId}`,
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
                    data.message || "Failed to delete user"
                );
            }

            setUsers(prevUsers =>
                prevUsers.filter(
                    user => user._id !== userId
                )
            );

        } catch (err) {

            console.error("Delete User Error:", err);

            setError(
                err.message || "Failed to delete user"
            );

        }
    };


    /* ================================
       SEARCH USERS
    ================================= */

    const filteredUsers = users.filter(user => {

        const searchValue = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.role?.toLowerCase().includes(searchValue)
        );

    });


    return (

        <div className="admin-users-page">

            <div className="admin-users-container">


                {/* ================================
                    HEADER
                ================================= */}

                <div className="admin-users-header">

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
                            Manage Users
                        </h1>

                        <p className="admin-page-description">
                            View and manage all registered
                            TaskFlow users.
                        </p>

                    </div>


                    {/* USER COUNT */}

                    <div className="admin-user-count">

                        <i className="ri-group-line"></i>

                        <div>

                            <span>
                                Total Users
                            </span>

                            <strong>
                                {users.length}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="admin-users-error">

                        <i className="ri-error-warning-line"></i>

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={fetchUsers}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* ================================
                    SEARCH
                ================================= */}

                <div className="admin-users-toolbar">

                    <div className="admin-search-box">

                        <i className="ri-search-line"></i>

                        <input
                            type="text"
                            placeholder="Search users by name, email or role..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (

                            <button
                                onClick={() =>
                                    setSearch("")
                                }
                                className="clear-search"
                            >
                                <i className="ri-close-line"></i>
                            </button>

                        )}

                    </div>

                </div>


                {/* ================================
                    USERS TABLE
                ================================= */}

                <div className="admin-users-card">


                    {/* LOADING */}

                    {loading ? (

                        <div className="admin-users-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading users...
                            </p>

                        </div>


                    ) : filteredUsers.length === 0 ? (

                        /* EMPTY */

                        <div className="admin-users-empty">

                            <div className="admin-empty-icon">

                                <i className="ri-user-search-line"></i>

                            </div>

                            <h3>
                                {search
                                    ? "No Users Found"
                                    : "No Users Available"}
                            </h3>

                            <p>
                                {search
                                    ? "Try searching with a different name, email or role."
                                    : "Registered users will appear here."}
                            </p>

                        </div>


                    ) : (

                        /* TABLE */

                        <div className="admin-table-wrapper">

                            <table className="admin-users-table">

                                <thead>

                                    <tr>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredUsers.map(user => (

                                        <tr key={user._id}>


                                            {/* USER */}

                                            <td>

                                                <div className="user-info">

                                                    <div className="user-avatar">

                                                        {user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                        <span>
                                                            ID:{" "}
                                                            {user._id.slice(-6)}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                <span className="user-email">
                                                    {user.email}
                                                </span>

                                            </td>


                                            {/* ROLE */}

                                            <td>

                                                <span
                                                    className={`user-role ${
                                                        user.role === "admin"
                                                            ? "admin-role"
                                                            : "user-role"
                                                    }`}
                                                >

                                                    {user.role === "admin"
                                                        ? "Admin"
                                                        : "User"}

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="user-actions">


                                                    {/* EDIT */}

                                                    <button
                                                        className="user-action-btn edit-btn"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                user
                                                            )
                                                        }
                                                        title="Edit User"
                                                    >

                                                        <i className="ri-edit-line"></i>

                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="user-action-btn delete-btn"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user._id
                                                            )
                                                        }
                                                        title="Delete User"
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


            {/* ================================
                EDIT USER MODAL
            ================================= */}

            {showEditModal && selectedUser && (

                <div className="admin-modal-overlay">

                    <div className="admin-edit-modal">


                        {/* MODAL HEADER */}

                        <div className="admin-modal-header">

                            <div>

                                <span>
                                    Edit User
                                </span>

                                <h2>
                                    Update User Details
                                </h2>

                            </div>


                            <button
                                className="modal-close-btn"
                                onClick={() => {

                                    setShowEditModal(false);
                                    setSelectedUser(null);

                                }}
                            >

                                <i className="ri-close-line"></i>

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleUpdateUser}
                        >


                            {/* NAME */}

                            <div className="admin-form-group">

                                <label>
                                    Name
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-user-line"></i>

                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="admin-form-group">

                                <label>
                                    Email
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-mail-line"></i>

                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="admin-form-group">

                                <label>
                                    Role
                                </label>

                                <div className="admin-input-wrapper">

                                    <i className="ri-shield-user-line"></i>

                                    <select
                                        name="role"
                                        value={editForm.role}
                                        onChange={handleEditChange}
                                    >

                                        <option value="user">
                                            User
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="admin-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={() => {

                                        setShowEditModal(false);
                                        setSelectedUser(null);

                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-update-btn"
                                >

                                    <i className="ri-save-line"></i>

                                    Update User

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
};

export default AdminUsers;
