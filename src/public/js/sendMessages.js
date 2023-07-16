const socket = io()
document.querySelector('#chatbox').scrollTop =
  document.querySelector('#chatbox').scrollHeight
const messageInput = document.getElementById('message')
const friendUsername = document
  .getElementById('friendUsername')
  .innerText.toLowerCase()
const username = document.getElementById('username').innerText.toLowerCase()
const sendButton = document.getElementById('send')

setInterval(() => {
  socket.emit('ping', 'ping')
}, 30000)

socket.emit('chat-room', { username })

sendButton.addEventListener('click', (e) => {
  e.preventDefault()
  const message = messageInput.value.trim()
  if (!message) {
    return
  }
  socket.emit('chat-message', { message, friendUsername })
  messageInput.value = ''
})

socket.on('chat-message', (message) => {
  const newMessage_container = document.createElement('div')
  if (message.sender.username === username) {
    newMessage_container.innerHTML = `
      <div class="chat chat-end">
        <div class="chat-bubble min-w-xs chat-bubble-secondary break-words">
          <p class="max-w-[200px]">${message.message}</p>
        </div>
      </div>
    `
  } else {
    newMessage_container.innerHTML = `
      <div class="chat chat-end">
        <div class="chat-bubble min-w-xs chat-bubble-primary break-words">
          <p class="max-w-[200px]">${message.message}</p>
        </div>
      </div>
    `
  }

  document.getElementById('chatroom').appendChild(newMessage_container)
  document.getElementById('chatbox').scrollTop =
    document.getElementById('chatbox').scrollHeight
})
