const io = require('socket.io')(3000,{cors:{origin:'*'}});

io.on("connection",(socket) => {
  console.log("User connected : " + socket.id);

  socket.on("message",(data)=>{
    console.log("received data. Now sending back data");
    socket.broadcast.emit('message',data);
  })

})

module.exports = io;