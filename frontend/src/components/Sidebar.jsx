import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, X, Settings } from "lucide-react";

const Sidebar = () => {
  const {
    searchUsers,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getUsers,
    allUsers,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load active chats on mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery) {
      // Reset to active chats list when search is cleared
      setUsers(allUsers || []);
      return;
    }
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, allUsers, searchUsers, setUsers]);

  // Filter by online status if toggled
  const filteredUsers = users.filter((user) =>
    showOnlineOnly ? onlineUsers.includes(user._id) : true
  );

  const onlineCount = Math.max(0, onlineUsers.length - 1); // Exclude yourself

  const clearSearch = () => {
    setSearchQuery("");
    setUsers(allUsers || []);
  };

  const formatLastSeen = (user) =>
    onlineUsers.includes(user._id) ? "Online" : "Offline";

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200 shadow-sm">
      {/* ── Header ── */}
      <div className="border-b border-base-300 p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden lg:block">
              <h2 className="font-semibold text-base-content">Chats</h2>
              <p className="text-xs text-base-content/60">
                {onlineCount} online · {users.length} contacts
              </p>
            </div>
          </div>

          {/* Settings button */}
          <button
            type="button"
            className="hidden lg:flex p-2 rounded-lg text-base-content/60 hover:bg-base-200 transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            className="w-full pl-10 pr-9 py-2 bg-base-200 border border-base-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 text-base-content placeholder-base-content/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Online-only toggle */}
        <div className="hidden lg:flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
                showOnlineOnly ? "bg-primary" : "bg-base-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  showOnlineOnly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-xs text-base-content/70">Online only</span>
          </label>
          <span className="text-xs text-base-content/50 bg-base-200 px-2 py-0.5 rounded-full">
            {onlineCount} online
          </span>
        </div>
      </div>

      {/* ── User List ── */}
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 gap-3">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-base-content/30" />
            </div>
            <p className="text-sm text-base-content/50 text-center">
              {searchQuery
                ? "No matching users found"
                : "No recent chats. Search for a contact to start messaging!"}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-primary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);

            return (
              <button
                key={user._id}
                type="button"
                onClick={() => setSelectedUser(user)}
                className={`w-full px-3 py-2 flex items-center gap-3 transition-all duration-150 group ${
                  isSelected
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-base-200 border-l-4 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${
                      isSelected ? "ring-primary/40" : "ring-base-200"
                    }`}
                  >
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                      isOnline ? "bg-success" : "bg-base-300"
                    }`}
                  />
                </div>

                {/* User info */}
                <div className="hidden lg:flex flex-1 min-w-0 flex-col text-left">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium text-sm truncate ${
                        isSelected ? "text-primary" : "text-base-content"
                      }`}
                    >
                      {user.fullName}
                    </h3>
                    {isOnline && (
                      <span className="text-xs text-success font-medium ml-2 flex-shrink-0">
                        ●
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${
                      isOnline ? "text-success" : "text-base-content/50"
                    }`}
                  >
                    {formatLastSeen(user)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── Footer: Current User ── */}
      <div className="border-t border-base-300 p-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-base-100">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="font-medium text-base-content truncate text-sm">
              {authUser?.fullName || authUser?.username || "You"}
            </p>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
