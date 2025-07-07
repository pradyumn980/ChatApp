import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  let lastShownDate = null;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-base-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-lg font-medium text-base-content">No messages yet</p>
                <p className="text-sm text-base-content/70 mt-1">Start the conversation!</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isSender = message.senderId === authUser._id;
            const isLastMessage = index === messages.length - 1;
            const currentDate = formatDate(message.createdAt);
            const showDate = currentDate !== lastShownDate;
            lastShownDate = currentDate;

            return (
              <div key={message._id} className="space-y-4">
                {/* Date Separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-base-200 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        {currentDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  ref={isLastMessage ? messageEndRef : null}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-xl p-3 shadow-sm
                      ${isSender 
                        ? "bg-primary text-primary-content" 
                        : "bg-base-200 text-base-content"
                      }
                    `}
                  >
                    {/* Message Image */}
                    {message.image && (
                      <div className="mb-3">
                        <img
                          src={message.image}
                          alt="Message attachment"
                          className="rounded-lg max-w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Message Text */}
                    {message.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    )}

                    {/* Message Time */}
                    <p
                      className={`
                        text-[10px] mt-1.5 
                        ${isSender ? "text-primary-content/70" : "text-base-content/70"}
                      `}
                    >
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-base-300 bg-base-100">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;