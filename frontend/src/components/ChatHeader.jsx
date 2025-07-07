import { X, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const isOnline = onlineUsers.includes(selectedUser._id);

  const getLastSeen = () => {
    if (isOnline) return "Online";
    // You can implement last seen logic here
    return "Last seen recently";
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
    setShowMenu(false);
  };

  return (
    <div className="relative bg-base-100 border-b border-base-300 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Back Button & User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back Button (Mobile) */}
          <button
            onClick={handleCloseChat}
            className="lg:hidden p-2 rounded-full hover:bg-base-200 transition-colors duration-200"
            aria-label="Go back to chat list"
          >
            <ArrowLeft className="w-5 h-5 text-base-content/70" />
          </button>

          {/* User Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-base-100 shadow-sm">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName || selectedUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Online Status Indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100 ${
              isOnline ? "bg-success" : "bg-base-content/30"
            }`}></div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base-content truncate text-sm sm:text-base">
              {selectedUser.fullName || selectedUser.username}
            </h3>
            <p className={`text-xs sm:text-sm font-medium ${
              isOnline 
                ? "text-success" 
                : "text-base-content/70"
            }`}>
              {getLastSeen()}
            </p>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Call Button */}
          <button
            className="hidden sm:flex p-2 rounded-full hover:bg-base-200 transition-colors duration-200 group"
            aria-label="Voice call"
          >
            <Phone className="w-5 h-5 text-base-content/70 group-hover:text-base-content" />
          </button>

          {/* Video Call Button */}
          <button
            className="hidden sm:flex p-2 rounded-full hover:bg-base-200 transition-colors duration-200 group"
            aria-label="Video call"
          >
            <Video className="w-5 h-5 text-base-content/70 group-hover:text-base-content" />
          </button>

          {/* More Options */}
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-full hover:bg-base-200 transition-colors duration-200 group"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-base-content/70 group-hover:text-base-content" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>

                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 z-20">
                  <div className="py-2">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-base-content hover:bg-base-200 transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      View Profile
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-base-content hover:bg-base-200 transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      Mute Notifications
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-base-content hover:bg-base-200 transition-colors duration-200"
                      onClick={() => setShowMenu(false)}
                    >
                      Clear Chat
                    </button>
                    <hr className="my-2 border-base-300" />
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors duration-200"
                      onClick={() => {
                        setShowMenu(false);
                        handleCloseChat();
                      }}
                    >
                      Close Chat
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Close Button (Desktop) */}
          <button
            onClick={handleCloseChat}
            className="hidden lg:flex p-2 rounded-full hover:bg-base-200 transition-colors duration-200 group"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-base-content/70 group-hover:text-base-content" />
          </button>
        </div>
      </div>

      {/* Optional: Typing Indicator */}
      {/* {isTyping && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-base-content/70">
              {selectedUser.fullName} is typing...
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ChatHeader;