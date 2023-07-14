const socket = io()
document.querySelector('#chatroom').scrollTop =
  document.querySelector('#chatroom').scrollHeight
const messageInput = document.querySelector('#message')
const friendUsername = document
  .querySelector('#friendUsername')
  .innerText.toLowerCase()
const username = document.querySelector('#username').innerText.toLowerCase()
const sendButton = document.querySelector('#send')
setInterval(() => {
  socket.emit('ping', 'ping')
}, 30000)

socket.emit('chat-room', { username })

sendButton.addEventListener('click', (e) => {
  // Get the trimmed value of the input
  e.preventDefault()
  const message = messageInput.value.trim()

  // If the message is empty, return
  if (!message) {
    return
  }

  // Send the message to the server
  socket.emit('chat-message', { message, friendUsername })

  // Clear the input
  messageInput.value = ''
})

// Add an event listener for the chat-message event
socket.on('chat-message', (message) => {
  const newMessage_container = document.createElement('div')
  newMessage_container.classList.add('message-container')
  if (message.sender.username === username) {
    newMessage_container.classList.add('message--sent')
  } else newMessage_container.classList.add('message--received')
  newMessage_container.innerHTML = `
        <div class="message">
            <p>${message.message}</p>
            <div class="message-timestamp">
                <p>${new Date(message.timestamp).toLocaleTimeString()}</p>
            </div>
        </div>
    `

  // Add the new message to the DOM
  document.querySelector('#chatroom').appendChild(newMessage_container)
  // go to end of chatroom
  document.querySelector('#chatroom').scrollTop =
    document.querySelector('#chatroom').scrollHeight
})
