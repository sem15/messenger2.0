const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8080', 'http://messenger-frontend.s3-website-us-east-1.amazonaws.com/']
  }
});

const users = []


app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    for(let i = 0; i < users.length; i++) {
      if(users[i].socketID == socket.id) {
        users.splice(i, 1)
      }
    }
    console.log('user disconnected');
    console.log("Number of active connections is now:", users.length)
    console.log(users)
  });

  //returns sessionid to frontend
  socket.on('request-sessionid', () => {
    io.to(socket.id).emit('return-sessionid', `${socket.id}`);
  });

  socket.on('register-ID', (data) => {
    let user = new Object()
    user.peerID = data.peerID
    user.name = data.name
    user.socketID = socket.id
    users.push(user)
    console.log(users)
  });

  //sends offer to target clients
  socket.on("offer", (message) => {
    const offer = message.offer;
    let targetClient

    // Send the offer to the other client
    for(let i = 0; i < users.length; i++) {
      if(users[i] != socket.id) {
        targetClient = users[i]
        console.log("target client:", targetClient)
      }
    }

    console.log(socket.id, '=>', targetClient)
    console.log(offer)

    //This is a temporary solution for testing and will assume there is only one other client who will connect.
    io.to(targetClient).emit('offer', offer);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
