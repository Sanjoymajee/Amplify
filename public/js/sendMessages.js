const socket = io();
const messageInput = document.querySelector("#message");
const friendUsername = document.querySelector("#friendUsername").innerText;
const username = document.querySelector("#username").innerText;
const sendButton = document.querySelector("#send");
// Add an event listener for the send button
socket.emit('chat-room',({username}));

sendButton.addEventListener("click", (e) => {
    // Get the trimmed value of the input
    e.preventDefault();
    const message = messageInput.value.trim();
    
    // If the message is empty, return
    if (!message) {
        return;
    }
    
    // Send the message to the server
    socket.emit("chat-message", {message, friendUsername, username});
    
    // Clear the input
    messageInput.value = "";
});

// Add an event listener for the chat-message event
socket.on("chat-message", (message) => {
    // console.log(message);
    // Create a new message element
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    if(message.sender.username === username) {
        newMessage.classList.add("message--sent");
    }
    else newMessage.classList.add("message--received");
    newMessage.innerHTML = `
        <p>${message.sender.username} : ${message.message}</p>
    `;
    // document.querySelector("#noMessages").remove();
    
    // Add the new message to the DOM
    document.querySelector("#chatroom").appendChild(newMessage);
    // go to end of chatroom
    document.querySelector("#chatroom").scrollTop = document.querySelector("#chatroom").scrollHeight;
});