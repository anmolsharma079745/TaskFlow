import { useEffect, useState } from "react";
import "./ProfileSection.css";

const ProfileSection = () => {

const [user, setUser] = useState(null);

const [showEditProfile, setShowEditProfile] = useState(false);
const [showChangePassword, setShowChangePassword] = useState(false);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setName(parsedUser.name || "");
        setPhone(parsedUser.phone || "");
    }
}, []);

const handleEditProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
        ...user,
        name,
        phone
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setShowEditProfile(false);
};

const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }


    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowChangePassword(false);

    alert("Password change request submitted.");
};

if (!user) {
    return (
        <main className="profile-section">
            <div className="profile-container">
                <div className="profile-empty">
                    <i className="ri-user-line"></i>
                    <h2>Profile Not Found</h2>
                    <p>Please login to view your profile.</p>
                </div>
            </div>
        </main>
    );
}

return (
    <main className="profile-section">

        <div className="profile-container">


            <div className="profile-heading">

                <div>
                    <span className="profile-badge">
                        <i className="ri-user-settings-line"></i>
                        MY PROFILE
                    </span>

                    <h1>
                        Account <span>Profile.</span>
                    </h1>

                    <p>
                        Manage your personal information and account
                        details from one place.
                    </p>
                </div>

            </div>



            <div className="profile-content">


                <div className="profile-card profile-main-card">

                    <div className="profile-card-top">

                        <div className="profile-avatar">
                            <i className="ri-user-line"></i>
                        </div>

                        <div className="profile-user-info">

                            <h2>{user.name}</h2>

                            <p>{user.email}</p>

                            <span className="profile-role">
                                <i className="ri-shield-user-line"></i>

                                {user.role === "admin"
                                    ? "Administrator"
                                    : "User"}
                            </span>

                        </div>

                    </div>


                    <div className="profile-divider"></div>



                    <div className="profile-details">

                        <div className="profile-detail">

                            <div className="detail-icon">
                                <i className="ri-user-3-line"></i>
                            </div>

                            <div>
                                <span>Full Name</span>
                                <strong>{user.name}</strong>
                            </div>

                        </div>


                        <div className="profile-detail">

                            <div className="detail-icon">
                                <i className="ri-mail-line"></i>
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>{user.email}</strong>
                            </div>

                        </div>


                        <div className="profile-detail">

                            <div className="detail-icon">
                                <i className="ri-phone-line"></i>
                            </div>

                            <div>
                                <span>Phone Number</span>

                                <strong>
                                    {user.phone || "Not provided"}
                                </strong>

                            </div>

                        </div>


                        <div className="profile-detail">

                            <div className="detail-icon">
                                <i className="ri-shield-check-line"></i>
                            </div>

                            <div>
                                <span>Account Role</span>

                                <strong>
                                    {user.role === "admin"
                                        ? "Administrator"
                                        : "User"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>



                <div className="profile-card profile-actions-card">

                    <div className="profile-card-header">

                        <div className="profile-card-icon">
                            <i className="ri-settings-3-line"></i>
                        </div>

                        <div>
                            <h3>Account Settings</h3>

                            <p>
                                Manage your account preferences.
                            </p>
                        </div>

                    </div>


                    <div className="profile-actions">

                        <button
                            className="profile-action-button"
                            onClick={() => setShowEditProfile(true)}
                        >
                            <span>
                                <i className="ri-edit-line"></i>
                                Edit Profile
                            </span>

                            <i className="ri-arrow-right-line"></i>
                        </button>


                        <button
                            className="profile-action-button"
                            onClick={() => setShowChangePassword(true)}
                        >
                            <span>
                                <i className="ri-lock-password-line"></i>
                                Change Password
                            </span>

                            <i className="ri-arrow-right-line"></i>
                        </button>

                    </div>

                </div>

            </div>

        </div>



        {showEditProfile && (

            <div
                className="profile-modal-overlay"
                onClick={() => setShowEditProfile(false)}
            >

                <div
                    className="profile-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <button
                        className="profile-modal-close"
                        onClick={() => setShowEditProfile(false)}
                    >
                        <i className="ri-close-line"></i>
                    </button>


                    <div className="profile-modal-header">

                        <div className="profile-modal-icon">
                            <i className="ri-edit-line"></i>
                        </div>

                        <div>
                            <h2>Edit Profile</h2>
                            <p>
                                Update your personal information.
                            </p>
                        </div>

                    </div>


                    <form
                        className="profile-form"
                        onSubmit={handleEditProfile}
                    >

                        <div className="profile-form-group">

                            <label>Full Name</label>

                            <div className="profile-input-wrapper">

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    required
                                />

                            </div>

                        </div>


                        <div className="profile-form-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                value={user.email}
                                disabled
                            />

                            <small>
                                Email address cannot be changed.
                            </small>

                        </div>


                        <div className="profile-form-group">

                            <label>Phone Number</label>

                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                placeholder="Enter your phone number"
                            />

                        </div>


                        <div className="profile-modal-actions">

                            <button
                                type="button"
                                className="profile-modal-cancel"
                                onClick={() =>
                                    setShowEditProfile(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-modal-save"
                            >
                                <i className="ri-save-line"></i>
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        )}



        {showChangePassword && (

            <div
                className="profile-modal-overlay"
                onClick={() => setShowChangePassword(false)}
            >

                <div
                    className="profile-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <button
                        className="profile-modal-close"
                        onClick={() =>
                            setShowChangePassword(false)
                        }
                    >
                        <i className="ri-close-line"></i>
                    </button>


                    <div className="profile-modal-header">

                        <div className="profile-modal-icon">
                            <i className="ri-lock-password-line"></i>
                        </div>

                        <div>
                            <h2>Change Password</h2>

                            <p>
                                Create a new secure password.
                            </p>
                        </div>

                    </div>


                    <form
                        className="profile-form"
                        onSubmit={handleChangePassword}
                    >

                        <div className="profile-form-group">

    <label>Current Password</label>

    <div className="profile-input-wrapper">

        <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) =>
                setCurrentPassword(e.target.value)
            }
            placeholder="Enter current password"
            required
        />

        <button
            type="button"
            className="profile-password-toggle"
            onClick={() =>
                setShowCurrentPassword(!showCurrentPassword)
            }
        >
            <i
                className={
                    showCurrentPassword
                        ? "ri-eye-off-line"
                        : "ri-eye-line"
                }
            ></i>
        </button>

    </div>

</div>


                        <div className="profile-form-group">

    <label>New Password</label>

    <div className="profile-input-wrapper">

        <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) =>
                setNewPassword(e.target.value)
            }
            placeholder="Enter new password"
            required
        />

        <button
            type="button"
            className="profile-password-toggle"
            onClick={() =>
                setShowNewPassword(!showNewPassword)
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


                        <div className="profile-form-group">

    <label>Confirm New Password</label>

    <div className="profile-input-wrapper">

        <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) =>
                setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            required
        />

        <button
            type="button"
            className="profile-password-toggle"
            onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
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


                        <div className="profile-modal-actions">

                            <button
                                type="button"
                                className="profile-modal-cancel"
                                onClick={() =>
                                    setShowChangePassword(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="profile-modal-save"
                            >
                                <i className="ri-lock-password-line"></i>
                                Update Password
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        )}

    </main>
);

};

export default ProfileSection;
