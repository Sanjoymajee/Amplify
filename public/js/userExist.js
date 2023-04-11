const socket = io();
const usernameInput = document.querySelector("#username");
const statusMessage = document.querySelector("#statusMessage");
let timeoutId;

// Set a timer ID
let timerId;

// Add an event listener for input on the username field
usernameInput.addEventListener("input", () => {
  // Clear any existing timer
  clearTimeout(timerId);

  // Get the trimmed value of the input
  const username = usernameInput.value.trim();

  // If the username is empty, clear the status message and return
  if (!username) {
    statusMessage.textContent = "";
    return;
  }

  if (!validateUsername(username)) {
    if (username.length < 3 || username.length > 20) {
      statusMessage.textContent =
        "Username must be between 3 and 20 characters long.";
      statusMessage.style.color = "#f00";
      return;
    }
    statusMessage.textContent =
      "Username can only contain letters, numbers and underscores.";
    statusMessage.style.color = "#f00";
    return;
  }

  // Set a new timer with a delay of 500ms
  timerId = setTimeout(() => {
    // Send a socket message to the server to check the username availability
    socket.emit(
      "checkUsername",
      { username: usernameInput.value },
      (result) => {
        // Update the status text based on the result
        if (result) {
          statusMessage.textContent = "Username is available!";
          statusMessage.style.color = "green";
        } else {
          statusMessage.textContent = "Username already exists.";
          statusMessage.style.color = "#f00";
        }
      }
    );
  }, 500);
});

function validateUsername(username) {
  const MIN_LENGTH = 3; // minimum length of the username
  const MAX_LENGTH = 20; // maximum length of the username
  const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/; // regular expression pattern to match username format

  if (username.length < MIN_LENGTH || username.length > MAX_LENGTH) {
    return false;
  }

  if (!USERNAME_PATTERN.test(username)) {
    return false;
  }

  return true;
}
