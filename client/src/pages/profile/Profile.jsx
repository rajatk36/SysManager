import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./profile.css";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Profile update states
  const [profileData, setProfileData] = useState({
    displayName: "",
    photoURL: ""
  });
  
  // Logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      if (user) {
        setProfileData({
          displayName: user.displayName || "",
          photoURL: user.photoURL || ""
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Error changing password";
      
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log back in before changing your password";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      setSuccess("Profile updated successfully!");
      setUser(auth.currentUser); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "password") {
      setPasswordData(prev => ({ ...prev, [name]: value }));
    } else if (section === "profile") {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <i className="bi bi-arrow-clockwise spin"></i>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <i className="bi bi-person-fill"></i>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{user.displayName || "User Profile"}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-meta">
            <span className="meta-item">
              <i className="bi bi-calendar"></i>
              Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
            </span>
            <span className="meta-item">
              <i className="bi bi-shield-check"></i>
              Email verified
            </span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <i className="bi bi-person"></i>
            Account Settings
          </button>
          <button 
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="bi bi-shield-lock"></i>
            Security
          </button>
          <button 
            className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            <i className="bi bi-gear"></i>
            Preferences
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "account" && (
            <div className="tab-panel">
              <h2>Account Information</h2>
              <form onSubmit={handleProfileUpdate} className="profile-form">
                {error && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-circle"></i>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-message">
                    <i className="bi bi-check-circle"></i>
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <div className="input-wrapper">
                    <i className="bi bi-person input-icon"></i>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="photoURL">Profile Photo URL</label>
                  <div className="input-wrapper">
                    <i className="bi bi-image input-icon"></i>
                    <input
                      type="url"
                      id="photoURL"
                      name="photoURL"
                      value={profileData.photoURL}
                      onChange={(e) => handleInputChange(e, "profile")}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="update-button">
                  {loading ? (
                    <>
                      <i className="bi bi-arrow-clockwise spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="tab-panel">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange} className="password-form">
                {error && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-circle"></i>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-message">
                    <i className="bi bi-check-circle"></i>
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => handleInputChange(e, "password")}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      <i className={showPasswords.current ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => handleInputChange(e, "password")}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      <i className={showPasswords.new ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handleInputChange(e, "password")}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      <i className={showPasswords.confirm ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </button>
                  </div>
                </div>

                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill ${passwordData.newPassword.length >= 8 ? 'strong' : passwordData.newPassword.length >= 6 ? 'medium' : 'weak'}`}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {passwordData.newPassword.length >= 8 ? 'Strong' : passwordData.newPassword.length >= 6 ? 'Medium' : 'Weak'} password
                  </span>
                </div>

                <button type="submit" disabled={loading} className="change-password-button">
                  {loading ? (
                    <>
                      <i className="bi bi-arrow-clockwise spin"></i>
                      Changing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i>
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="tab-panel">
              <h2>Account Actions</h2>
              <div className="preferences-content">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Sign Out</h3>
                    <p>Sign out of your account on this device</p>
                  </div>
                  <button 
                    className="logout-button"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Sign Out
                  </button>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Account Security</h3>
                    <p>Your account is secured with Firebase Authentication</p>
                  </div>
                  <div className="security-status">
                    <i className="bi bi-shield-check"></i>
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Sign Out</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLogoutConfirm(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to sign out of your account?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button"
                onClick={handleLogOut}
              >
                <i className="bi bi-box-arrow-right"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
