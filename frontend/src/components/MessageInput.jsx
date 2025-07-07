import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Paperclip, Smile } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to load image");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const canSend = (text.trim() || imagePreview) && !isUploading;

  return (
    <div className="p-4 bg-base-100 border-t border-base-300">
      <div className="max-w-4xl mx-auto">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 p-3 bg-base-200 rounded-xl border border-base-300">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="w-16 h-16 object-cover rounded-lg border border-base-300 shadow-sm"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error hover:bg-error/90 text-error-content flex items-center justify-center shadow-md transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  type="button"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content">
                  Image attached
                </p>
                <p className="text-xs text-base-content/70">
                  Ready to send
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-end gap-2 p-3 bg-base-200 rounded-2xl border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
            
            {/* Attachment Button */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={isUploading}
              />
              
              <button
                type="button"
                className={`p-2 rounded-full transition-all duration-200 ${
                  imagePreview 
                    ? "text-primary bg-primary/10" 
                    : "text-base-content/70 hover:text-base-content hover:bg-base-300"
                } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Attach image"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-base-content/30 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent resize-none border-0 outline-none text-base-content placeholder-base-content/50 text-sm leading-relaxed min-h-[24px] max-h-[120px] py-1"
                placeholder="Type your message..."
                value={text}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isUploading}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!canSend}
              className={`p-2 rounded-full transition-all duration-200 ${
                canSend
                  ? "bg-primary hover:bg-primary/90 text-primary-content shadow-md hover:shadow-lg transform hover:scale-105"
                  : "bg-base-300 text-base-content/50 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send className={`w-5 h-5 ${canSend ? "translate-x-0.5" : ""}`} />
            </button>
          </div>

          {/* Character Count or Typing Indicator */}
          {text.length > 0 && (
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-xs text-base-content/70">
                {text.length > 500 && (
                  <span className={text.length > 1000 ? "text-error" : "text-warning"}>
                    {text.length}/1000
                  </span>
                )}
              </div>
              <div className="text-xs text-base-content/70">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageInput;