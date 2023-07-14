const usernameInput = document.querySelector('#username')
const statusMessage = document.querySelector('#statusMessage')
let timerId

usernameInput.addEventListener('input', () => {
  clearTimeout(timerId)
  const username = usernameInput.value.trim().toLowerCase()
  // If the username is empty, clear the status message and return
  if (!username) {
    statusMessage.textContent = ''
    return
  }

  if (!validateUsername(username)) {
    if (username.length < 3 || username.length > 20) {
      statusMessage.textContent =
        'Username must be between 3 and 20 characters long.'
      statusMessage.style.color = '#f00'
      return
    }
    statusMessage.textContent =
      'Username can only contain letters, numbers and underscores.'
    statusMessage.style.color = '#f00'
    return
  }
  console.log(username)
  const url = '/check-username?username=' + username
  console.log(url)
  timerId = setTimeout(() => {
    ajax(url, (response) => {
      if (response.available) {
        statusMessage.textContent = 'Username is available!'
        statusMessage.style.color = 'green'
      } else {
        statusMessage.textContent = 'Username already exists.'
        statusMessage.style.color = '#f00'
      }
    })
  }, 500)
})

function validateUsername(username) {
  const MIN_LENGTH = 3 // minimum length of the username
  const MAX_LENGTH = 20 // maximum length of the username
  const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/ // regular expression pattern to match username format

  if (username.length < MIN_LENGTH || username.length > MAX_LENGTH) {
    return false
  }

  if (!USERNAME_PATTERN.test(username)) {
    return false
  }

  return true
}
