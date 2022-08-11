// const io = require("socket.io");
//connect with  server and client
const socket = io("http://127.0.0.1:8000");

//DOM processing
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// addition of musinc
var audio = new Audio("ting.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};
// form submit handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You : ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
// taking input
const name = prompt("Enter your name to join ");
socket.emit("new-user-joined", name);

// executes when user joins
socket.on("user-joined", (user) => {
  append(`${user} joined the chat`, "right");
});

//executes when user recieves message
socket.on("recieved", (data) => {
  append(`${data.name}:${data.message}`, "left");
});

// executes when user leaves the connection
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});
