import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // State
  messages: [],
  users: [],
  allUsers: [],     // Full list of all contacts (source of truth)
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Setters
  setUsers: (users) => set({ users }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

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

  // Load ALL users (WhatsApp-style: show everyone immediately)
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data, allUsers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get messages for a selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message and move recipient to the top of active chats
  sendMessage: async (messageData) => {
    const { selectedUser, messages, users } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });

      // Move selectedUser to the top of the sidebar list
      const updatedUsers = [selectedUser, ...users.filter((u) => u._id !== selectedUser._id)];
      set({ users: updatedUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Socket subscription for receiving new messages globally
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); // Avoid duplicate listeners

    socket.on("newMessage", async (newMessage) => {
      const { selectedUser, users } = get();

      // If the message is related to the currently selected user, append to messages
      if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)) {
        set({ messages: [...get().messages, newMessage] });
      }

      // Determine the chat partner's ID
      const otherUserId = newMessage.senderId === useAuthStore.getState().authUser._id 
        ? newMessage.receiverId 
        : newMessage.senderId;

      // Find if they are already in the loaded users list
      let contactUser = users.find((u) => u._id === otherUserId);

      // If they are not in the list, fetch their details from the backend
      if (!contactUser) {
        try {
          const res = await axiosInstance.get(`/users/${otherUserId}`);
          contactUser = res.data;
        } catch (error) {
          console.error("Could not fetch user details for new message:", error);
        }
      }

      if (contactUser) {
        // Move the contact to the top of the users list
        const updatedUsers = [contactUser, ...users.filter((u) => u._id !== otherUserId)];
        set({ users: updatedUsers });
      }

      // Show toast notification if message is from a different user and not sent by current user
      if ((!selectedUser || newMessage.senderId !== selectedUser._id) && newMessage.senderId !== useAuthStore.getState().authUser._id) {
        if (contactUser) {
          toast(`New message from ${contactUser.fullName}`, {
            icon: "💬",
          });
        }
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
