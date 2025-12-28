// Test script to verify message functionality
// Run this in browser console after starting the app

console.log("Testing message functionality...");

// Test 1: Check if socket is connected
console.log("Socket connection status:", window.socket?.connected || "Not connected");

// Test 2: Test message sending
async function testSendMessage() {
  try {
    const useChatStore = window.useChatStore;
    if (!useChatStore) {
      console.error("Chat store not found");
      return;
    }
    
    const store = useChatStore.getState();
    if (!store.selectedUser) {
      console.error("No user selected");
      return;
    }
    
    await store.sendMessage({ text: "Test message" });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

// Test 3: Test image upload
async function testImageUpload() {
  try {
    const input = document.querySelector('input[type="file"]');
    if (input) {
      console.log("Image upload input found");
    } else {
      console.error("Image upload input not found");
    }
  } catch (error) {
    console.error("Image upload test failed:", error);
  }
}

// Test 4: Check message display
function testMessageDisplay() {
  const messages = document.querySelectorAll('[class*="message"]');
  console.log(`Found ${messages.length} message elements`);
}

// Run tests
setTimeout(() => {
  testSendMessage();
  testImageUpload();
  testMessageDisplay();
}, 2000);

console.log("Message functionality tests initiated");
