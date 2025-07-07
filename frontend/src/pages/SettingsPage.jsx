import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Eye, Check } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "That sounds awesome! Can't wait to see them.", isSent: false },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-base-content">Settings</h1>
            </div>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Customize your chat experience with different themes and personalization options
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Theme Selection Panel */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-base-100 rounded-2xl shadow-lg p-6 space-y-6">
                
                {/* Theme Section Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Palette className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-base-content">Theme Selection</h2>
                    <p className="text-sm text-base-content/70">Choose your preferred color scheme</p>
                  </div>
                </div>

                {/* Current Theme Display */}
                <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden" data-theme={theme}>
                      <div className="grid grid-cols-2 gap-0.5 h-full p-1">
                        <div className="rounded-sm bg-primary"></div>
                        <div className="rounded-sm bg-secondary"></div>
                        <div className="rounded-sm bg-accent"></div>
                        <div className="rounded-sm bg-neutral"></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-base-content">Current Theme</span>
                      <p className="text-xs text-base-content/70">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Theme Grid */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-base-content">Available Themes</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        className={`
                          group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200
                          ${theme === t 
                            ? "bg-primary/10 border-2 border-primary shadow-lg scale-105" 
                            : "bg-base-200 border-2 border-transparent hover:border-base-300 hover:shadow-md hover:scale-102"
                          }
                        `}
                        onClick={() => setTheme(t)}
                      >
                        {/* Theme Preview */}
                        <div className="relative h-10 w-full rounded-lg overflow-hidden shadow-sm" data-theme={t}>
                          <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5">
                            <div className="rounded bg-primary"></div>
                            <div className="rounded bg-secondary"></div>
                            <div className="rounded bg-accent"></div>
                            <div className="rounded bg-neutral"></div>
                          </div>
                        </div>
                        
                        {/* Theme Name */}
                        <span className="text-xs font-medium truncate w-full text-center text-base-content">
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </span>
                        
                        {/* Selected Indicator */}
                        {theme === t && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-3 h-3 text-primary-content" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                
                {/* Preview Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-300">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Eye className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Live Preview</h3>
                    <p className="text-sm text-base-content/70">See how your theme looks</p>
                  </div>
                </div>

                {/* Chat Preview */}
                <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-sm">
                  
                  {/* Chat Header */}
                  <div className="px-4 py-3 bg-base-200 border-b border-base-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium text-sm">
                        J
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-base-content">John Doe</h4>
                        <p className="text-xs text-success flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                          Online
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-3 h-48 overflow-y-auto bg-base-100">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[85%] rounded-xl p-3 shadow-sm
                            ${message.isSent 
                              ? "bg-primary text-primary-content" 
                              : "bg-base-200 text-base-content"
                            }
                          `}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p
                            className={`
                              text-[10px] mt-1.5 
                              ${message.isSent ? "text-primary-content/70" : "text-base-content/50"}
                            `}
                          >
                            12:0{message.id} PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-300 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-sm h-10 focus:outline-none"
                        placeholder="Type a message..."
                        value="This is a preview message"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0 px-4">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info Card */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-base-300">
                <h4 className="font-semibold text-base-content mb-3">Theme Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Active Theme:</span>
                    <span className="font-medium text-base-content">
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Total Themes:</span>
                    <span className="font-medium text-base-content">{THEMES.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Auto-saves:</span>
                    <span className="font-medium text-success">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;