import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);


  return (
    <>
      <header className="bg-base-100/95 backdrop-blur-md border-b border-base-300 fixed w-full top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group"
              >
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold text-base-content">Chatty</h1>
              </Link>
            </div>

            {/* Navigation Actions */}
            <nav className="flex items-center gap-2">
              {/* Settings Link */}
              <Link
                to="/settings"
                className="btn btn-sm btn-ghost gap-2 hover:btn-primary hover:text-primary-content transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {/* Authenticated User Actions */}
              {authUser && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-base-300">
                  {/* Profile Link */}
                  <Link 
                    to="/profile" 
                    className="btn btn-sm btn-ghost gap-2 hover:btn-secondary hover:text-secondary-content transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  {/* Logout Button */}
                  <button 
                    onClick={() => setShowConfirmLogout(true)}
                    className="btn btn-sm btn-ghost gap-2 hover:btn-error hover:text-error-content transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Confirm Logout Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-base-100 border border-base-content/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-lg font-bold text-base-content">Log Out</h3>
              <p className="text-sm text-base-content/60">
                Are you sure you want to log out? You will need to log back in to access your conversations.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmLogout(false)}
                className="btn btn-ghost flex-1 sm:flex-initial"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmLogout(false);
                  logout();
                }}
                className="btn btn-error flex-1 sm:flex-initial text-error-content font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;