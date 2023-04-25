// const socket = io();
// const messageInput = document.querySelector("#message");
// const sendButton = document.querySelector("#send");

// // Add an event listener for the send button
// sendButton.addEventListener("click", (e) => {
//     // Get the trimmed value of the input
//     e.preventDefault();
//     const message = messageInput.value.trim();
//     console.log(message);
    
//     // If the message is empty, return
//     if (!message) {
//         return;
//     }
    
//     // Send the message to the server
//     socket.emit("chat-message", message);
    
//     // Clear the input
//     messageInput.value = "";
// });