import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
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
                  onClick={logout}
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
  );
};

export default Navbar;