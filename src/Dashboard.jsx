import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCamera, FaKey } from "react-icons/fa";

export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPicModal, setShowPicModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Token ${token}` },
  };

  // Fetch profile on load
  useEffect(() => {
    axios
      .get("http://13.61.177.195:8000/api/profile/", config)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  // Update profile pic
  const handlePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePicFile) return alert("Select a file first!");

    const formData = new FormData();
    formData.append("profile_pic", profilePicFile);

    try {
      const res = await axios.patch(
        "http://13.61.177.195:8000/api/profile/update-pic/",
        formData,
        config
      );
      setProfile({ ...profile, profilePic: res.data.profilePic });
      alert("Profile picture updated!");
      setShowPicModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile picture.");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Enter new password!");

    try {
      await axios.post(
        "http://13.61.177.195:8000/api/change-password/",
        { new_password: newPassword },
        config
      );
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to change password.");
    }
  };

  if (loading) return <h2 className="text-center mt-20">Loading...</h2>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 flex flex-col items-center p-10">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        Welcome, {profile.username}!
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-2 bg-white text-gray-800 px-5 py-3 rounded-lg shadow-lg hover:scale-105 transform transition"
        >
          <FaUser /> View Profile
        </button>

        <button
          onClick={() => setShowPicModal(true)}
          className="flex items-center gap-2 bg-white text-gray-800 px-5 py-3 rounded-lg shadow-lg hover:scale-105 transform transition"
        >
          <FaCamera /> Update Profile Pic
        </button>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 bg-white text-gray-800 px-5 py-3 rounded-lg shadow-lg hover:scale-105 transform transition"
        >
          <FaKey /> Change Password
        </button>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            <div className="flex flex-col items-center gap-3">
              {profile.profilePic && (
                <img
                  src={`http://13.61.177.195:8000${profile.profilePic}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Update Pic Modal */}
      {showPicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setShowPicModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>
            <form onSubmit={handlePicUpload} className="flex flex-col gap-4">
              <input
                type="file"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
                accept="image/*"
                required
              />
              <button
                type="submit"
                className="bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              X
            </button>

            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-3 rounded-md"
                required
              />

              {/* Password Rules */}
              <div className="text-sm space-y-1">
                <Rule text="Minimum 8 characters" valid={newPassword.length >= 8} />
                <Rule text="One uppercase letter" valid={/[A-Z]/.test(newPassword)} />
                <Rule text="One lowercase letter" valid={/[a-z]/.test(newPassword)} />
                <Rule text="One number" valid={/[0-9]/.test(newPassword)} />
                <Rule
                  text="One special character"
                  valid={/[^A-Za-z0-9]/.test(newPassword)}
                />
              </div>

              <button
                type="submit"
                disabled={
                  !(
                    newPassword.length >= 8 &&
                    /[A-Z]/.test(newPassword) &&
                    /[a-z]/.test(newPassword) &&
                    /[0-9]/.test(newPassword) &&
                    /[^A-Za-z0-9]/.test(newPassword)
                  )
                }
                className={`py-2 rounded-md transition text-white ${
                  newPassword.length >= 8 &&
                  /[A-Z]/.test(newPassword) &&
                  /[a-z]/.test(newPassword) &&
                  /[0-9]/.test(newPassword) &&
                  /[^A-Za-z0-9]/.test(newPassword)
                    ? "bg-pink-500 hover:bg-pink-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Rule component must be OUTSIDE Dashboard
function Rule({ text, valid }) {
  return (
    <p className={`flex items-center gap-2 ${valid ? "text-green-600" : "text-red-500"}`}>
      {valid ? "✔" : "✖"} {text}
    </p>
  );
}

