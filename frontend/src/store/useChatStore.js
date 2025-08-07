import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [],
  recentUsers: [],  // Recent chats list
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Setters
  setUsers: (users) => set({ users }),
  setRecentUsers: (recentUsers) => set({ recentUsers }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Add a user to recentUsers if not already present
  addUserToRecent: (user) =>
    set((state) => {
      if (state.recentUsers.find((u) => u._id === user._id)) return {};
      return { recentUsers: [user, ...state.recentUsers] };
    }),

  // Search users by query (invoked on search input with 3+ chars)
  searchUsers: async (query) => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get(`/users/search?q=${query}`);
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Load users related to messages / recent chats (optional backend API)
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data, recentUsers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get messages for a selected user and track user as recent
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // Add selected user to recentUsers
      const user = get().users.find((u) => u._id === userId);
      if (user) {
        get().addUserToRecent(user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message and add selected user to recentChats
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });

      if (selectedUser) {
        get().addUserToRecent(selectedUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Socket subscription for receiving new messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });

      // Add sender to recent if not present
      const user = get().users.find((u) => u._id === newMessage.senderId);
      if (user) {
        get().addUserToRecent(user);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
