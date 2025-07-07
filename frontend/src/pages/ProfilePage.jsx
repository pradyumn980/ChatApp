import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-2xl shadow-lg p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-base-content">Profile</h1>
                <p className="text-base-content/70">Manage your account information</p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <div className="size-32 rounded-full overflow-hidden border-4 border-base-300 shadow-lg">
                    <img
                      src={selectedImg || authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <label
                    htmlFor="avatar-upload"
                    className={`
                      absolute bottom-0 right-0 
                      bg-primary hover:bg-primary-focus 
                      p-3 rounded-full cursor-pointer 
                      shadow-lg transform transition-all duration-200
                      hover:scale-110 active:scale-95
                      ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-50" : ""}
                    `}
                  >
                    <Camera className="w-5 h-5 text-primary-content" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-sm text-base-content/60">
                    {isUpdatingProfile ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="loading loading-spinner loading-sm"></span>
                        Uploading...
                      </span>
                    ) : (
                      "Click the camera icon to update your photo"
                    )}
                  </p>
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-base-content border-b border-base-300 pb-2">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-base-content/70">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Full Name</span>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                      <p className="text-base-content font-medium">{authUser?.fullName}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-base-content/70">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Mail className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm font-medium">Email Address</span>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                      <p className="text-base-content font-medium">{authUser?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-base-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-info" />
                </div>
                Account Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-base-300">
                  <span className="text-base-content/70">Member Since</span>
                  <span className="text-base-content font-medium">
                    {authUser.createdAt ? formatDate(authUser.createdAt) : "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-base-content/70">Account Status</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-base-300">
              <h3 className="text-lg font-semibold text-base-content mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Profile Complete</span>
                  <span className="text-primary font-bold">100%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;