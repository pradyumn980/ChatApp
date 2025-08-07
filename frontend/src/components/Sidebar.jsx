import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Filter, X, UserPlus, Settings } from "lucide-react";

const Sidebar = () => {
  const {
    searchUsers,
    users,
    setUsers,
    recentUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Display recent users by default or when search is short
  useEffect(() => {
    if (searchQuery.length < 3) {
      setUsers(recentUsers);
    }
  }, [recentUsers, searchQuery, setUsers]);

  

  // Debounced search on query changes (for 3+ chars)
 useEffect(() => {
  if (searchQuery.length < 3) {
    setUsers(recentUsers);
    return;
  }

  const timer = setTimeout(() => {
    searchUsers(searchQuery);
  }, 1000);

  return () => clearTimeout(timer);
}, [searchQuery, recentUsers, searchUsers, setUsers]);  // These two stable from Zustand


  // Filter users by online status if toggled
  const filteredUsers = users.filter((user) =>
    showOnlineOnly ? onlineUsers.includes(user._id) : true
  );

  const onlineCount = onlineUsers.length - 1; // Exclude yourself

  const clearSearch = () => {
    setSearchQuery("");
    setUsers(recentUsers);
  };

  const formatLastSeen = (user) => (onlineUsers.includes(user._id) ? "Online" : "Last seen recently");

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-base-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden lg:block">
              <h2 className="font-semibold text-base-content">Contacts</h2>
              <p className="text-xs text-base-content/70">
                {onlineCount} online • {users.length} shown
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showFilters || showOnlineOnly
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
              aria-label="Filter options"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-base-content/70 hover:bg-base-200 transition-colors duration-200"
              aria-label="Add contact"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              className="w-full pl-10 pr-10 py-2 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content/70"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="hidden lg:block mt-3 p-3 bg-base-200 rounded-lg border border-base-300">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="text-sm text-base-content">Show online only</span>
              </label>
              <span className="text-xs text-base-content/70 bg-base-300 px-2 py-1 rounded-full">
                {onlineCount} online
              </span>
            </div>
          </div>
        )}
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-base-content/50" />
            </div>
            <p className="text-sm text-base-content/70 text-center">
              {searchQuery.length < 3
                ? recentUsers.length === 0
                  ? "No recent chats yet"
                  : "Start typing to search contacts"
                : users.length === 0
                ? "No users found"
                : null}
            </p>
            {searchQuery.length >= 3 && (
              <button
                type="button"
                onClick={clearSearch}
                className="mt-2 text-primary text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {filteredUsers.map((user) => {
              const isSelected = selectedUser?._id === user._id;
              const isOnline = onlineUsers.includes(user._id);
              return (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg transition-all duration-200 group ${
                    isSelected
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-base-200 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-base-100 shadow-sm">
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName || user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Online status */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100 ${
                        isOnline ? "bg-success" : "bg-base-content/30"
                      }`}
                    ></div>
                  </div>
                  {/* User details */}
                  <div className="hidden lg:block flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium truncate ${
                          isSelected ? "text-primary" : "text-base-content"
                        }`}
                      >
                        {user.fullName || user.username}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs truncate ${
                          isSelected
                            ? "text-primary/70"
                            : isOnline
                            ? "text-success"
                            : "text-base-content/70"
                        }`}
                      >
                        {formatLastSeen(user)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Current User */}
      <div className="border-t border-base-300 p-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-base-100 shadow-sm">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="font-medium text-base-content truncate text-sm">
              {authUser?.fullName || "You"}
            </p>
            <p className="text-xs text-success">Online</p>
          </div>
          <button
            type="button"
            className="hidden lg:block p-2 rounded-lg text-base-content/70 hover:bg-base-200 transition-colors duration-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
