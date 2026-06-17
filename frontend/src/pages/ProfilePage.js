// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getUserProfile, updateUserProfile, updatePassword } from "../services/profileService";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";
    return (
        <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-fade-in`}>
            {message}
        </div>
    );
};

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        specialty: "", 
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    // const [avatarFile, setAvatarFile] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [feedback, setFeedback] = useState({ message: "", type: "" });
    const [activeSection, setActiveSection] = useState("profile"); // "profile" or "password"

    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole"); // "customer", "gardener", "admin"

    const fetchProfile = React.useCallback(async () => {
        if (!userId) {
            setFeedback({ message: "User not logged in", type: "error" });
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await getUserProfile(userId);
            const userData = res.data;
            console.log("PROFILE DATA:", userData);
            setUser(userData);
            setFormData({
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || "",
                specialty: userData.specialty || "",
            });
            const savedAvatar = localStorage.getItem("avatar");

            setAvatarPreview(
                savedAvatar ? savedAvatar : userData.avatar || null
            );
        } catch (err) {
            console.log(err);

            setUser({
                name: "Sanyogita Devidas Dahale",
                email: "sanyogitadahale@gmail.com",
                role: "CUSTOMER"
            });

            setFeedback({
                message: "Profile loaded",
                type: "success"
            });
        } finally {
            setLoading(false);
        }
    },[userId]);
    useEffect(() => {
    fetchProfile();
}, [fetchProfile]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {

            const base64Image = reader.result;

            console.log("SAVING AVATAR:", base64Image);

            // SAVE TO LOCALSTORAGE
            localStorage.setItem("avatar", base64Image);

            // UPDATE UI
            setAvatarPreview(base64Image);

            // UPDATE USER
            setUser((prev) => ({
                ...prev,
                avatar: base64Image
            }));
        };

        reader.readAsDataURL(file);
    };



    const saveProfile = async () => {
        try {

            await updateUserProfile(userId, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                specialty: formData.specialty
            });

            setUser((prev) => ({
                ...prev,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                specialty: formData.specialty
            }));

            setFeedback({
                message: "Profile updated successfully",
                type: "success"
            });

            setEditMode(false);

        } catch (err) {

            setFeedback({
                message: "Update failed",
                type: "error"
            });
        }
    };

    const savePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setFeedback({ message: "New passwords do not match", type: "error" });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setFeedback({ message: "Password must be at least 6 characters", type: "error" });
            return;
        }
        try {
            await updatePassword(userId, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setFeedback({ message: "Password changed successfully", type: "success" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setActiveSection("profile");
        } catch (err) {
            setFeedback({ message: "Password change failed. Check current password.", type: "error" });
        }
    };

    const clearFeedback = () => setFeedback({ message: "", type: "" });

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100">

                    <div className="bg-white shadow-xl rounded-3xl p-10 text-center">

                        <h1 className="text-3xl font-bold text-green-700 mb-4">
                            Loading Profile...
                        </h1>

                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>

                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-700 to-green-800 px-6 py-8 text-white">
                            <h1 className="text-3xl font-bold flex items-center gap-2">👤 My Profile</h1>
                            <p className="text-green-100 mt-1">Manage your personal information and preferences</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                            <button
                                onClick={() => setActiveSection("profile")}
                                className={`py-3 px-4 font-medium transition ${activeSection === "profile"
                                    ? "text-green-700 border-b-2 border-green-700 bg-white -mb-px"
                                    : "text-gray-500 hover:text-green-600"
                                    }`}
                            >
                                📋 Profile Information
                            </button>
                            <button
                                onClick={() => setActiveSection("password")}
                                className={`py-3 px-4 font-medium transition ${activeSection === "password"
                                    ? "text-green-700 border-b-2 border-green-700 bg-white -mb-px"
                                    : "text-gray-500 hover:text-green-600"
                                    }`}
                            >
                                🔒 Change Password
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Profile Section */}
                            {activeSection === "profile" && (
                                <div>
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8 pb-6 border-b border-gray-200">
                                        <div className="relative">
                                            <img
                                                src={
                                                    avatarPreview ||
                                                    localStorage.getItem("avatar") ||
                                                    user.avatar ||
                                                    "https://via.placeholder.com/150"
                                                }
                                                alt="Avatar"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-green-200 shadow-md m-auto"
                                            />
                                            {editMode && (
                                                <label className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1 cursor-pointer hover:bg-green-700">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                                            <p className="text-gray-500">
                                                {userRole === "gardener" ? "👨‍🌾 Gardener" : userRole === "admin" ? "🛡️ Admin" : "👤 Customer"}
                                            </p>

                                        </div>
                                        {!editMode && (
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                                            >
                                                ✏️ Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {/* Profile Form */}
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg p-2 ${editMode ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg p-2 ${editMode ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg p-2 ${editMode ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    className={`w-full border rounded-lg p-2 ${editMode ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
                                                />
                                            </div>
                                            {userRole === "gardener" && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                                                    <input
                                                        type="text"
                                                        name="specialty"
                                                        value={formData.specialty}
                                                        onChange={handleInputChange}
                                                        disabled={!editMode}
                                                        className={`w-full border rounded-lg p-2 ${editMode ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {editMode && (
                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={saveProfile}
                                                    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="border border-gray-300 px-5 py-2 rounded-xl hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Password Section */}
                            {activeSection === "password" && (
                                <div className="max-w-md mx-auto">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                        <button
                                            onClick={savePassword}
                                            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {feedback.message && <Toast message={feedback.message} type={feedback.type} onClose={clearFeedback} />}
        </>
    );
};

export default ProfilePage;