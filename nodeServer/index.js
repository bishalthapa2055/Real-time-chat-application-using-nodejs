// const io = require("socket.io")(8000);
const express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  // if any person joins connection then server knows
  socket.on("new-user-joined", (name) => {
    // console.log("new users", name);
    // if user is connected then execute this event handler
    users[socket.id] = name;

    // then user - joined is broadcast to all users
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("recieved", {
      // if message is recieved then displayed to all
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    // if users disconnects then notify to all users
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
